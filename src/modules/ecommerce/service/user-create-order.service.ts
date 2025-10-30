import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Book,
  Order,
  OrderItem,
  Payment,
  RentalItem,
  User,
} from '@/modules/entity';
import { DataSource, Repository } from 'typeorm';
import { UserOrderDto } from '@/modules/ecommerce/dto/user-order.dto';
import { BaseService } from '@/base/service/base-service.service';
import { AdminBookService } from '@/modules/ecommerce/service/admin-book.service';
import {
  BookStatus,
  RentalType,
  TransactionType,
} from '@/modules/ecommerce/enums/product.enum';
import { validate } from 'class-validator';
import {
  OrderStatus,
  PaymentStatus,
} from '@/modules/ecommerce/enums/order.enum';
import { RentalItemDto } from '@/modules/ecommerce/dto/rental-item.dto';
import { OrderItemDto } from '@/modules/ecommerce/dto/order-item.dto';
import { config } from '@/config';
import { RedisService } from '@/base/database/redis/redis.service';
import { isNil } from 'lodash';
import { LoggingService } from '@/base/logging/logging.service';
import { VnPayService } from '@/provider/vnpay/vnpay.service';
import { OrderDto } from '@/modules/ecommerce/dto/order.dto';

export const TIME_LOCK = config.CACHE_LOCK_LONG_TIMEOUT;
export const getStockKey = (productId: string) => `STOCK_LOCK:${productId}`;

@Injectable()
export class UserCreateOrderService extends BaseService<Order> {
  private logger: LoggingService;
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(RentalItem)
    private readonly rentalItemRepo: Repository<RentalItem>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    private readonly bookService: AdminBookService,
    private readonly cache: RedisService,
    private loggingService: LoggingService,
    private vnPayService: VnPayService,
    private readonly dataSource: DataSource,
  ) {
    super(orderRepository);
    this.logger = loggingService.getCategory(UserCreateOrderService.name);
  }

  async validate(dto: string[]) {
    for (let i = 0; i < dto.length; i++) {
      const book = await this.bookService.getOne({
        id: dto[i],
        status: BookStatus.PUBLISHED,
      });
      if (!book) {
        throw new BadRequestException('Book not found');
      }
    }
  }

  calculatorMoneyRental(
    type: RentalType,
    book: Book,
    quantity: number,
  ): number {
    switch (type) {
      case RentalType.DAILY:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return book.rentPricePerDay * quantity;
      case RentalType.MONTHLY:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return book.rentPricePerMonth * quantity;
      case RentalType.WEEKLY:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return book.rentPenaltyPerWeek * quantity;
    }
  }

  /**
   * hàm tạo order của user
   * @param user người tạo order
   * @param dto truyene lên địa chỉ và item
   */
  async createOrder(user: User, dto: UserOrderDto, ipAddr: string) {
    // --- PHẦN 1: VALIDATE & CHUẨN BỊ DỮ LIỆU (Ngoài Transaction) ---
    // Các thao tác "ĐỌC" (READ) nên thực hiện trước khi bắt đầu transaction
    // để giảm thời gian transaction khóa CSDL.

    const bookIds = dto.items.map((orderItem) => orderItem.bookId);
    await this.validate(bookIds); // Kiểm tra sách tồn tại & published

    const itemDtos = await Promise.all(
      dto.items.map(async (item) => {
        const book = await this.bookService.getOne({
          id: item.bookId,
          status: BookStatus.PUBLISHED,
        });
        return { book, ...item };
      }),
    );

    // Tinh tong tien
    let totalRentalAmount = 0;
    let totalAmount = 0;
    itemDtos.forEach((item) => {
      if (item.type === TransactionType.RENTAL) {
        const amount = this.calculatorMoneyRental(
          item.rentalType,
          item.book,
          item.quantity,
        );
        totalRentalAmount += amount;
        totalAmount += amount;
      } else {
        totalAmount += item.quantity * Number(item.book.sellerPrice);
      }
    });

    const createOrder: OrderDto = {
      userId: user.id,
      status: OrderStatus.PROCESSING,
      totalAmount: String(totalAmount),
      totalRentalAmount: String(totalRentalAmount),
      addressId: dto.addressId,
    };

    // --- PHẦN 2: KHỞI TẠO TRANSACTION ---
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // 3. Chuẩn bị một mảng để "hoàn tác" Redis nếu lỗi
    const lockedBooks: { book: Book; quantity: number }[] = [];

    try {
      // 4. Dùng queryRunner.manager cho tất cả thao tác GHI (WRITE)

      // Tạo payment
      const newPayment = this.paymentRepo.create({
        userId: user.id,
        amount: createOrder.totalAmount,
        status: PaymentStatus.PAYING,
      });
      const payment = await queryRunner.manager.save(newPayment);

      // Tạo order
      const order = await queryRunner.manager.save(
        this.orderRepository.create({
          ...createOrder,
          paymentId: payment.id,
          ...(dto?.rentalType && {
            rentalType: dto.rentalType,
            rentStart: new Date(),
            rentDue: new Date(
              Date.now() +
                this.dayOfRentalType(dto.rentalType) * 24 * 60 * 60 * 1000,
            ),
          }),
        }),
      );

      // Tạo orderItem / rentalItem và LOCK KHO (Redis)
      for (let i = 0; i < itemDtos.length; i++) {
        const item = itemDtos[i];

        // 5. Khóa kho (Redis)
        // Phải nằm trong 'try' để nếu nó lỗi, CSDL sẽ rollback
        await this.lockBook(order, item.book, item.quantity);
        // Thêm vào mảng để rollback thủ công nếu cần
        lockedBooks.push({ book: item.book, quantity: item.quantity });

        // Tạo item tương ứng
        if (item.type === TransactionType.RENTAL) {
          const rentalItem: RentalItemDto = {
            orderId: order.id,
            bookId: item.book.id,
            rentalType: item.rentalType,
            quantity: item.quantity,
            rentStart: new Date(),
            rentDue: new Date(
              Date.now() +
                this.dayOfRentalType(dto.rentalType) * 24 * 60 * 60 * 1000,
            ),
          };
          await queryRunner.manager.save(
            this.rentalItemRepo.create(rentalItem),
          );
        } else {
          const orderItem: OrderItemDto = {
            orderId: order.id,
            bookId: item.book.id,
            quantity: item.quantity,
            subtotal: String(Number(item.book.sellerPrice) * item.quantity),
            unitPrice: item.book.sellerPrice,
          };
          await queryRunner.manager.save(this.orderItemRepo.create(orderItem));
        }
      }

      // 6. Mọi thứ OK -> Commit CSDL
      await queryRunner.commitTransaction();

      // --- PHẦN 3: THAO TÁC SAU COMMIT (Ngoài Transaction) ---
      // Tạo URL thanh toán
      payment.order = order; // Gán order đã commit vào payment
      const paymentUrl = this.vnPayService.createPaymentUrl(payment, ipAddr);
      return { paymentUrl, ...order };
    } catch (err) {
      // 7. Có lỗi -> Rollback CSDL
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction rolled back', err);

      // 8. Rollback REDIS thủ công
      this.logger.warn('Manually unlocking products from Redis...');
      for (const locked of lockedBooks) {
        await this.unLockProduct(locked.book, locked.quantity, this.logger);
      }

      // Ném lỗi ra ngoài
      throw new BadRequestException(
        err.message || 'Failed to create order. Transaction rolled back.',
      );
    } finally {
      // 9. LUÔN LUÔN release queryRunner
      await queryRunner.release();
    }
  }

  async lockBook(order: Order, book: Book, quantity: number) {
    const stockKey = getStockKey(book.id);
    const cacheQty = await this.cache.getValueByKey(stockKey);
    let stockQty: number;

    if (isNil(cacheQty)) {
      stockQty = book.stockQty;
      await this.cache.setNx(stockKey, book.stockQty, TIME_LOCK);
    } else {
      stockQty = parseInt(cacheQty);
    }

    if (stockQty < quantity)
      throw new BadRequestException('Sản phẩm đã hết hàng hoặc không đủ qty');

    const lockedCount = await this.cache.incrby(stockKey, -1 * quantity);

    if (!lockedCount || lockedCount < 0)
      throw new BadRequestException('Sản phẩm đang trong giao dịch');
  }

  async unLockProduct(book: Book, quantity: number, log: LoggingService) {
    try {
      await this.cache.incrby(getStockKey(book.id), quantity);
    } catch (error) {
      log.error(error);
    }
  }

  // tính số ngày thue + 4 chenh lech ngay giao hang
  dayOfRentalType(rentalType: RentalType) {
    const deliveryGap = 4; // số ngày chênh lệch giao hàng

    switch (rentalType) {
      case RentalType.DAILY:
        return 7 + deliveryGap;
      case RentalType.WEEKLY:
        return 14 + deliveryGap;
      case RentalType.MONTHLY:
      default:
        return 30 + deliveryGap;
    }
  }
}
