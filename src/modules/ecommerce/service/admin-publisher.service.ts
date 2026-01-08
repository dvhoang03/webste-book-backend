import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Publisher } from '@/modules/entity/publisher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminPublisherService extends BaseService<Publisher> {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {
    super(publisherRepository);
  }
}
