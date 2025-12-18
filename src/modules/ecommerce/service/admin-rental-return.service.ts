import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { RentalReturn } from '@/modules/entity/rental-return.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseListDto } from '@/base/service/base-list.dto';

@Injectable()
export class AdminRentalReturnService extends BaseService<RentalReturn> {
  constructor(
    @InjectRepository(RentalReturn)
    private readonly rentalReturnRepo: Repository<RentalReturn>,
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
}
