import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { User } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminUserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
