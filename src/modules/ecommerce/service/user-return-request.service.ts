import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { ReturnRequest } from '@/modules/entity/return-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReturnItem } from '@/modules/entity/return-item.entity';
import { UserReturnRequestDto } from '@/modules/ecommerce/dto/user-return-request.dto';
import { Order, OrderItem, User } from '@/modules/entity';
import { ReturnStatus } from '@/modules/ecommerce/enums/return.enum';
import { UpdateReturnRequestDto } from '@/modules/ecommerce/dto/return-request.dto';
import * as moment from 'moment';

@Injectable()
export class UserReturnRequestService extends BaseService<ReturnRequest> {
  constructor(
    @InjectRepository(ReturnRequest)
    private readonly returnRequestRepo: Repository<ReturnRequest>,
    @InjectRepository(ReturnItem)
    private readonly returnItemRepo: Repository<ReturnItem>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {
    super(returnRequestRepo);
  }

  // src/modules/ecommerce/service/user-return-request.service.ts

  async createReturnRequest(user: User, dto: UserReturnRequestDto) {
    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId },
      relations: ['shipping'],
    });
    if (!order) throw new BadRequestException('order not found');
    if (moment(order.shipping.deliveredDate).add(7, 'day').isBefore(moment())) {
      throw new BadRequestException(
        'Time for return is expire. 7 days have passed',
      );
    }
    const returnItems = await Promise.all(
      dto.itemsReturn.map(async (item) => {
        const orderItem = await this.orderItemRepo.findOne({
          where: { id: item.orderItemId },
          relations: ['book'],
        });
        if (!orderItem)
          throw new Error(`Order item ${item.orderItemId} not found`);
        const refundAmountNumber = item.quantity * orderItem.book.sellerPrice;
        return {
          orderItemId: item.orderItemId,
          quantity: item.quantity,
          reason: item.reason ?? undefined,
          refundAmount: refundAmountNumber,
        };
      }),
    );
    const totalRefundAmount = returnItems.reduce(
      (total, item) => total + item.refundAmount,
      0,
    );

    const returnRequestSaved = this.returnRequestRepo.create({
      orderId: dto.orderId,
      userId: user.id,
      status: ReturnStatus.PENDING,
      customerNote: dto.customerNote, // <--- ĐÃ SỬA
      totalRefundAmount: totalRefundAmount,
    });
    await Promise.all(
      returnItems.map(async (item) => {
        await this.returnItemRepo.save({
          ...item,
          returnRequestId: returnRequestSaved.id,
        });
      }),
    );
    return returnRequestSaved;
  }

  async updateReturnRequest(
    id: string,
    user: User,
    dto: UpdateReturnRequestDto,
  ) {
    const returnRequest = await this.returnRequestRepo.findOneBy({
      userId: user.id,
      id,
    });
    if (
      !returnRequest ||
      (returnRequest.status !== ReturnStatus.PENDING &&
        returnRequest.status !== ReturnStatus.APPROVED)
    ) {
      throw new BadRequestException(
        'Return request is processing so not modify',
      );
    }

    return await this.update(id, dto);
  }
}
