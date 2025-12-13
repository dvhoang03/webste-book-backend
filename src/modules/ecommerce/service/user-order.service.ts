import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Order } from '@/modules/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ListOrderDto } from '@/modules/ecommerce/dto/order.dto';
import { BaseListDto } from '@/base/service/base-list.dto';

@Injectable()
export class UserOrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {
    super(orderRepo);
  }

  protected addRelations<D extends BaseListDto>(
    qb: SelectQueryBuilder<Order>,
    dto: D, // Bạn có thể dùng DTO để quyết định xem có JOIN hay không
  ): SelectQueryBuilder<Order> {
    const alias = qb.alias; // Lấy alias gốc (ví dụ: 't')

    // Thêm JOIN và SELECT luôn relation 'author'
    // Giờ đây 'author' là một alias hợp lệ
    // qb.leftJoinAndSelect(`${alias}.author`, 'author');

    // Bạn cũng có thể chỉ JOIN để filter/sort mà không SELECT
    qb.leftJoinAndSelect(`${alias}.shipping`, 'shipping');
    qb.leftJoinAndSelect(`${alias}.payment`, 'payment');
    qb.leftJoinAndSelect(`${alias}.orderItems`, 'orderItem');
    qb.leftJoinAndSelect(`${alias}.rentalItems`, 'rentalItem');

    return qb;
  }
}
