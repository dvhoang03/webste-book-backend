import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Category } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminCategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {
    super(categoryRepo);
  }
}
