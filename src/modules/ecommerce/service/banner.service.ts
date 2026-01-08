import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Banner } from '@/modules/entity/banner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BannerService extends BaseService<Banner> {
  constructor(
    @InjectRepository(Banner)
    protected readonly entity: Repository<Banner>,
  ) {
    super(entity);
  }
}
