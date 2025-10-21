import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book, Order, User } from '@/modules/entity';
import { Repository } from 'typeorm';
import {
  Items,
  OrderDto,
  UserOrderDto,
} from '@/modules/ecommerce/dto/user-order.dto';
import { BaseService } from '@/base/service/base-service.service';
import { AdminBookService } from '@/modules/ecommerce/service/admin-book.service';
import {
  BookStatus,
  RentalType,
  TransactionType,
} from '@/modules/ecommerce/enums/product.enum';
import { validate } from 'class-validator';
import { OrderStatus } from '@/modules/ecommerce/enums/order.enum';

@Injectable()
export class UserOrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly bookService: AdminBookService,
  ) {
    super(orderRepository);
  }

  async validate(dto: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const id in dto) {
      await this.bookService.getOne({
        id,
        status: BookStatus.PUBLISHED,
      });
    }
  }

  caculatorMoneyRental(type: RentalType, book: Book, quantity: number): number {
    switch (type) {
      case RentalType.DAILY:
        // @ts-ignore
        return book.rentPricePerDay * quantity;
      case RentalType.MONTHLY:
        // @ts-ignore
        return book.rentPricePerMonth * quantity;
      case RentalType.WEEKLY:
        // @ts-ignore
        return book.rentPenaltyPerWeek * quantity;
    }
  }

  async preCreateOrder(user: User, books: Book[], dto: UserOrderDto) {
    const rentalItem: Items[] = [];
    const purchaseItem: Items[] = [];
    dto.items.forEach((item) => {
      if (item.type === TransactionType.PURCHASE) {
        purchaseItem.push(item);
      } else {
        rentalItem.push(item);
      }
    });

    const totalAmount = rentalItem.map((item) => {
      return this.caculatorMoneyRental();
    });

    const order: OrderDto = {
      userId: user.id,
      status: OrderStatus.PROCESSING,
    };
  }

  async createOrder(user: User, dto: UserOrderDto) {
    const bookIds = dto.items.map((orderItem) => {
      return orderItem.bookId;
    });
    await validate(bookIds);

    const books = await this.bookService.listByIds(bookIds);
  }
}
