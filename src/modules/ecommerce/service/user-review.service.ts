import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Review } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserReviewService extends BaseService<Review> {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {
    super(reviewRepository);
  }
}
