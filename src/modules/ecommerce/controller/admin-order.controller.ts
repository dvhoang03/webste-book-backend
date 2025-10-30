import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { UserOrderService } from '@/modules/ecommerce/service/user-order.service';
import { ListOrderDto } from '@/modules/ecommerce/dto/order.dto';
import { User } from '@/modules/entity';

@ApiTagAndBearer('Admin/ Order')
@Controller('admin-order')
export class UserOrderController {
  constructor(private readonly userOrder: UserOrderService) {}

  @Get()
  async list(@Query() query: ListOrderDto) {
    // query.filter = Object.assign({}, query.filter, { userId: user.id });
    return this.userOrder.list(query);
  }
}
