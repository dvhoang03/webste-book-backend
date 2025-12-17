import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { UserOrderService } from '@/modules/ecommerce/service/user-order.service';
import { SkipAuth, UserAuth } from '@/modules/auth/auth.decorator';
import { JwtUserGuard } from '@/modules/auth/jwt-user/jwt-user.guard';
import { ListOrderDto } from '@/modules/ecommerce/dto/order.dto';
import { User } from '@/modules/entity';
import { PostgresIdParam } from '@/base/dto/base.dto';
import { OrderStatus } from '@/modules/ecommerce/enums/order.enum';
import { ApiOperation } from '@nestjs/swagger';

@ApiTagAndBearer('User/ Order')
@SkipAuth()
@UseGuards(JwtUserGuard)
@Controller('order')
export class UserOrderController {
  constructor(private readonly userOrder: UserOrderService) {}

  @Get()
  async list(@Query() query: ListOrderDto, @UserAuth() user: User) {
    query.filter = Object.assign({}, query.filter, { userId: user.id });
    return this.userOrder.list(query);
  }

  @Get(':id')
  async retrieve(@Param() param: PostgresIdParam, @UserAuth() user: User) {
    return await this.userOrder.getOne({ id: param.id, userId: user.id }, [
      'user',
      'payment',
      'shipping',
      'address',
      'orderItems',
      'orderItems.book',
      'rentalItems',
      'rentalItems.book',
    ]);
  }

  @ApiOperation({ summary: 'api huy order cua' })
  @Patch(':id')
  async cancelOrder(@Param() param: PostgresIdParam, @UserAuth() user: User) {
    const order = await this.userOrder.getOne({
      id: param.id,
      userId: user.id,
    });
    console.log(order);
    if (
      !order ||
      (order.status !== OrderStatus.WAIT_FOR_DELIVERY &&
        order.status !== OrderStatus.PROCESSING)
    ) {
      throw new BadRequestException('Order is shipping, must be not cancel');
    }
    return await this.userOrder.update(param.id, {
      status: OrderStatus.CANCEL,
    });
  }
}
