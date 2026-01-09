import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { RentalReturn } from '@/modules/entity/rental-return.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseListDto } from '@/base/service/base-list.dto';
import { AdminRentalItemService } from '@/modules/ecommerce/service/admin-rental-item.service';
import { UpdateRentalReturnDto } from '@/modules/ecommerce/dto/rental-return.dto';
import { AdminOrderController } from '@/modules/ecommerce/controller/admin-order.controller';
import { UserOrderService } from '@/modules/ecommerce/service/user-order.service';
import * as moment from 'moment';
import { AdminBookService } from '@/modules/ecommerce/service/admin-book.service';

@Injectable()
export class AdminRentalReturnService extends BaseService<RentalReturn> {
  constructor(
    @InjectRepository(RentalReturn)
    private readonly rentalReturnRepo: Repository<RentalReturn>,
    private readonly adminReturnItemService: AdminRentalItemService,
    private readonly adminOrderService: UserOrderService,
    private readonly bookService: AdminBookService,
  ) {
    super(rentalReturnRepo);
  }

  protected addRelations<D extends BaseListDto>(
    qb: SelectQueryBuilder<RentalReturn>,
    dto: D,
  ): SelectQueryBuilder<RentalReturn> {
    const alias = qb.alias;
    qb.leftJoinAndSelect(`${alias}.order`, 'order');
    qb.leftJoinAndSelect(`${alias}.user`, 'user');
    return qb;
  }

  async updateReturn(id: string, dto: UpdateRentalReturnDto) {
    const rentalReturn = await this.update(id, {
      status: dto.status,
      adminNote: dto.adminNote,
    });
    const order = await this.adminOrderService.getOne({
      id: rentalReturn.orderId,
    });
    const days = Math.max(
      0,
      moment(dto.receivedAt)
        .startOf('day')
        .diff(moment(order.rentDue).startOf('day'), 'days'),
    );

    if (dto?.rentalItems) {
      for (const item of dto.rentalItems) {
        await this.adminReturnItemService.update(item.id, { ...item });
        const itemReturn = await this.adminReturnItemService.getOne(
          {
            id: item.id,
          },
          ['book'],
        );
        await this.bookService.update(itemReturn.bookId, {
          stockQty: itemReturn.book.stockQty + item.returnQuantity,
        });
      }
    }

    const itemsRental = await this.adminReturnItemService.listForOrder(
      rentalReturn.orderId,
    );
    const totalPenalty = itemsRental.reduce(
      (total, item) => (item?.penalty ? total + item.penalty : total),
      0,
    );

    const overdueUnit = itemsRental.reduce(
      (total, item) =>
        item?.book?.rentPenaltyPerDay
          ? total + item?.book?.rentPenaltyPerDay
          : total,
      0,
    );

    const totalRefundAmount = itemsRental.reduce(
      (total, item) =>
        item?.book?.rentDeposit ? total + item?.book?.rentDeposit : total,
      0,
    );
    return await this.update(id, {
      totalPenalty,
      overdueFee: days * overdueUnit,
      refundAmount: totalRefundAmount - days * overdueUnit - totalPenalty,
    });
  }
}
