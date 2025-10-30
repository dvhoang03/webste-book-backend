import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipping } from '@/modules/entity/shipping.entity';
import { Repository } from 'typeorm';
import { UserOrderService } from '@/modules/ecommerce/service/user-order.service';
import { BaseService } from '@/base/service/base-service.service';
import {
  CreateShippingDto,
  UpdateShippingDto,
} from '@/modules/ecommerce/dto/shipping.dto';
import { OrderStatus } from '@/modules/ecommerce/enums/order.enum';

@Injectable()
export class AdminShippingService extends BaseService<Shipping> {
  constructor(
    @InjectRepository(Shipping)
    private readonly shippingRepo: Repository<Shipping>,
    private readonly orderService: UserOrderService,
  ) {
    super(shippingRepo);
  }

  async createShipping(dto: CreateShippingDto) {
    const order = await this.orderService.getOne({
      id: dto.orderId,
      status: OrderStatus.WAIT_FOR_SHIPPING,
    });
    const shipping = await this.create({ ...dto, addressId: order.addressId });
    return await this.orderService.update(order.id, {
      shippingId: shipping.id,
    });
  }

  async updateShipping(id: string, dto: UpdateShippingDto) {
    return await this.update(id, dto);
  }
}
