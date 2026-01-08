import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '@/modules/entity';
import { Repository } from 'typeorm';
import { BaseService } from '@/base/service/base-service.service';

@Injectable()
export class UserAddressService extends BaseService<Address> {
  constructor(
    @InjectRepository(Address)
    private readonly entity: Repository<Address>,
  ) {
    super(entity);
  }
}
