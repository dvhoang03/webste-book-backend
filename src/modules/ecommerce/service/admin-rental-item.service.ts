import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { RentalItem } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseListDto } from '@/base/service/base-list.dto';

@Injectable()
export class AdminRentalItemService extends BaseService<RentalItem> {
  constructor(
    @InjectRepository(RentalItem)
    private readonly rentalItemRepo: Repository<RentalItem>,
  ) {
    super(rentalItemRepo);
  }
  protected addRelations<D extends BaseListDto>(
    qb: SelectQueryBuilder<RentalItem>,
    dto: D,
  ): SelectQueryBuilder<RentalItem> {
    const alias = qb.alias;
    qb.leftJoinAndSelect(`${alias}.book`, 'book');
    return qb;
  }
}
