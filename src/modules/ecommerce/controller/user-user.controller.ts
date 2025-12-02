import { Body, Controller, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { CreateUserDto, UpdateUserDto } from '@/modules/ecommerce/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';

@ApiTagAndBearer('User/ User')
@Controller('user')
@SkipAuth()
@UseGuards(JwtUserGuard)
export class UserUserController {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  @Patch()
  async updateProfile(@UserAuth() user: User, @Body() dto: UpdateUserDto) {
    const { password } = dto;
    if (password) dto.password = await bcrypt.hash(password, 10);
    await this.userRepo.update(user.id, dto);
    return await this.userRepo.findOneBy({ id: user.id });
  }
}
