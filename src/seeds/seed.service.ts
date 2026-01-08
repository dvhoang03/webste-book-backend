import { Injectable } from '@nestjs/common';
import { User } from '@/modules/entity';
import { Repository } from 'typeorm';
import { Role } from '@/modules/user/user.enum';
import { CreateUserDto } from '@/modules/ecommerce/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    await this.seedUsers();
  }

  private async seedUsers() {
    const adminUser: CreateUserDto = {
      isActive: true,
      fullName: 'admin',
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin', 10),
      role: Role.ADMIN,
      phone: '94890218410',
    };

    const existingAdmin = await this.userRepository.findOne({
      where: { email: 'admin' },
    });
    if (!existingAdmin) {
      const newUser = this.userRepository.create(adminUser);
      await this.userRepository.save(newUser);
    }
  }
}
