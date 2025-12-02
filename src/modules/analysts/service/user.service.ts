import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { User } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/modules/user/user.enum';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly entity: Repository<User>,
  ) {
    super(entity);
  }

  async getTotalUser() {
    return await this.entity.countBy({ role: Role.USER });
  }
}
