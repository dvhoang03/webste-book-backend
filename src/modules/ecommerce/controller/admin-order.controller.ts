import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { UserOrderService } from '@/modules/ecommerce/service/user-order.service';
import { ListOrderDto } from '@/modules/ecommerce/dto/order.dto';
import { PostgresIdParam } from '@/base/dto/base.dto';
import { OrderStatus } from '@/modules/ecommerce/enums/order.enum';
import { ApiOperation } from '@nestjs/swagger';

@ApiTagAndBearer('Admin/ Order')
@Controller('admin-order')
export class AdminOrderController {
  constructor(private readonly userOrder: UserOrderService) {}

  @Get()
  async list(@Query() query: ListOrderDto) {
    // query.filter = Object.assign({}, query.filter, { userId: user.id });
    return this.userOrder.list(query);
  }

  @Get(':id')
  async retrieve(@Param() param: PostgresIdParam) {
    return await this.userOrder.getOne({ id: param.id }, [
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
  async cancelOrder(@Param() param: PostgresIdParam) {
    const order = await this.userOrder.getOne(param);
    if (!order || order.status !== OrderStatus.WAIT_FOR_DELIVERY) {
      throw new BadRequestException('Order is shipping, must be not cancel');
    }
    return await this.userOrder.update(param.id, {
      status: OrderStatus.CANCEL,
    });
  }
}
