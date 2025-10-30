import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { UserCreateOrderService } from '@/modules/ecommerce/service/user-create-order.service';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { User } from '@/modules/entity';
import { UserOrderDto } from '@/modules/ecommerce/dto/user-order.dto';
import { Request } from 'express';

@ApiTagAndBearer('User/ Create/ Order')
@SkipAuth()
@Controller('create-order')
export class UserCreateOrderController {
  constructor(private readonly service: UserCreateOrderService) {}

  @UseGuards(JwtUserGuard)
  @Post()
  async createOrder(
    @Req() req: Request,
    @UserAuth() user: User,
    @Body() dto: UserOrderDto,
  ) {
    const ipAddr =
      req?.headers['x-forwarded-for'] ||
      req?.connection?.remoteAddress ||
      req?.socket?.remoteAddress;
    return await this.service.createOrder(user, dto, ipAddr as string);
  }
}
