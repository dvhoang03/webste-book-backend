import { Injectable } from '@nestjs/common';
import { LoggingService } from '@/base/logging/logging.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Book, Order, OrderItem, Payment, RentalItem } from '@/modules/entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { VnPayService } from '@/provider/vnpay/vnpay.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import {
  OrderStatus,
  PaymentStatus,
} from '@/modules/ecommerce/enums/order.enum';
import { UserCreateOrderService } from '@/modules/ecommerce/service/user-create-order.service';

@Injectable()
export class CheckTransactionSchedule {
  private readonly logger: LoggingService;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order) // <-- 1. Inject OrderRepository
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Book) // <-- 1. Inject OrderRepository
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(RentalItem)
    private readonly rentalItemRepository: Repository<RentalItem>,
    private readonly vnPayService: VnPayService,
    private readonly loggingService: LoggingService,
    private readonly userCreateOrderService: UserCreateOrderService,
  ) {
    this.logger = loggingService.getCategory(CheckTransactionSchedule.name);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkTransactionVnPay() {
    this.logger.log('Running cron job to check pending VNPAY transactions...');

    const thirdtyMinutesAgo = moment().add(-30, 'minute').toDate();
    const pendingPayments = await this.paymentRepository.find({
      where: {
        status: PaymentStatus.PAYING,
        createdAt: LessThanOrEqual(thirdtyMinutesAgo),
      },
      relations: ['order'],
    });

    if (!pendingPayments.length) {
      this.logger.log('No pending transactions found.');
      return;
    }

    this.logger.log(
      `Found ${pendingPayments.length} pending transactions. Querying VNPAY...`,
    );

    for (const payment of pendingPayments) {
      try {
        const responseData = await this.vnPayService.queryTransaction(payment);
        if (!responseData) {
          this.logger.warn(
            `No valid response for payment ${payment.id}. Skipping.`,
          );
          continue;
        }

        const vnp_ResponseCode = responseData.vnp_ResponseCode;
        const vnp_TransactionStatus = responseData.vnp_TransactionStatus;

        const order = await this.orderRepository.findOne({
          where: { id: payment.order.id },
          relations: ['purchaseItems', 'rentalItems'],
        });

        if (!order) return;

        // Nếu thành công
        if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
          this.logger.log(`Payment ${payment.id} SUCCESS. Updating DB...`);

          payment.status = PaymentStatus.PAID;
          payment.order.status = OrderStatus.WAIT_FOR_SHIPPING;

          // Trừ sản phẩm trong kho
          for (const item of order.purchaseItems ?? []) {
            await this.bookRepository.decrement(
              { id: item.bookId },
              'stockQty',
              item.quantity,
            );
          }
          for (const item of order.rentalItems ?? []) {
            await this.bookRepository.decrement(
              { id: item.bookId },
              'stockQty',
              item.quantity,
            );
          }
        } else {
          // Nếu không thành công hoặc quá hạn
          this.logger.log(
            `Payment ${payment.id} FAILED or EXPIRED. Reverting stock...`,
          );

          payment.status = PaymentStatus.PAYMENT_ERROR;
          payment.order.status = OrderStatus.PAYMENT_ERROR;

          // Mở kho lại (unlock stock)
          for (const item of order.purchaseItems ?? []) {
            await this.userCreateOrderService.unLockProduct(
              item.book,
              item.quantity,
              this.logger,
            );
          }
          for (const item of order.rentalItems ?? []) {
            await this.userCreateOrderService.unLockProduct(
              item.book,
              item.quantity,
              this.logger,
            );
          }
        }

        // Lưu dữ liệu phản hồi
        payment.transactionNo = responseData.vnp_TransactionNo;
        payment.responseCode = vnp_ResponseCode;
        payment.transactionStatus = vnp_TransactionStatus;
        payment.rawData = JSON.stringify(responseData);

        await this.orderRepository.save(payment.order);
        await this.paymentRepository.save(payment);
      } catch (error) {
        this.logger.error(`Failed to process transaction ${payment.id}`, error);
      }
    }
  }
}
