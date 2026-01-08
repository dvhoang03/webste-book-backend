import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
  ) {}

  async findOneEmail(email: string) {
    return await this.userModel.findOne({ where: { email } });
  }

  async findOneID(id: string) {
    return await this.userModel.findOne({ where: { id } });
  }

  async validateUser(email: string, plain: string) {
    const user = await this.findOneEmail(email);
    if (!user) throw new UnauthorizedException();
    if (!(await bcrypt.compare(plain, user.password)))
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu.');
    return user;
  }
}
