import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { UserOrderService } from '@/modules/ecommerce/service/user-order.service';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { User } from '@/modules/entity';
import { UserOrderDto } from '@/modules/ecommerce/dto/user-order.dto';

@ApiTagAndBearer()
@SkipAuth()
@Controller('order')
export class UserOrderController {
  constructor(private readonly service: UserOrderService) {}

  @UseGuards(JwtUserGuard)
  @Post()
  async createOrder(@UserAuth() user: User, @Body() dto: UserOrderDto) {
    return await this.service.createOrder(user, dto);
  }
}
