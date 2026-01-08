import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Review } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseListDto } from '@/base/service/base-list.dto';
import { Policy } from '@/modules/entity/policy.entity';

@Injectable()
export class UserReviewService extends BaseService<Review> {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {
    super(reviewRepository);
  }

  protected addRelations<D extends BaseListDto>(
    qb: SelectQueryBuilder<Review>,
    dto: D,
  ): SelectQueryBuilder<Review> {
    const alias = qb.alias; // 't'

    //    Từ 'bookCategory' (đã join ở trên), join tiếp vào 'category'
    qb.leftJoinAndSelect(`${alias}.user`, 'user');

    return qb;
  }
}
