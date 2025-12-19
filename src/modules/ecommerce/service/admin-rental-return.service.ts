import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { RentalReturn } from '@/modules/entity/rental-return.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseListDto } from '@/base/service/base-list.dto';
import { AdminRentalItemService } from '@/modules/ecommerce/service/admin-rental-item.service';
import { UpdateRentalReturnDto } from '@/modules/ecommerce/dto/rental-return.dto';

@Injectable()
export class AdminRentalReturnService extends BaseService<RentalReturn> {
  constructor(
    @InjectRepository(RentalReturn)
    private readonly rentalReturnRepo: Repository<RentalReturn>,
    private readonly adminReturnItemService: AdminRentalItemService,
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

    if (dto?.rentalItems) {
      for (const item of dto.rentalItems) {
        await this.adminReturnItemService.update(item.id, { ...item });
      }
    }

    const itemsRental = await this.adminReturnItemService.listForOrder(
      rentalReturn.orderId,
    );
    const totalPenalty = itemsRental.reduce(
      (total, item) => (item?.penalty ? total + item.penalty : total),
      0,
    );

    return await this.update(id, { totalPenalty });
  }
}
