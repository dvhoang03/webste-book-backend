import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { ReturnRequest } from '@/modules/entity/return-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReturnItem } from '@/modules/entity/return-item.entity';
import { UserReturnRequestDto } from '@/modules/ecommerce/dto/user-return-request.dto';
import { OrderItem, User } from '@/modules/entity';
import { ReturnStatus } from '@/modules/ecommerce/enums/return.enum';

@Injectable()
export class UserReturnRequestService extends BaseService<ReturnRequest> {
  constructor(
    @InjectRepository(ReturnRequest)
    private readonly returnRequestRepo: Repository<ReturnRequest>,
    @InjectRepository(ReturnItem)
    private readonly returnItemRepo: Repository<ReturnItem>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {
    super(returnRequestRepo);
  }

  // src/modules/ecommerce/service/user-return-request.service.ts

  async createReturnRequest(user: User, dto: UserReturnRequestDto) {
    const returnItems = await Promise.all(
      dto.itemsReturn.map(async (item) => {
        const orderItem = await this.orderItemRepo.findOne({
          where: { id: item.orderItemId },
          relations: ['book'],
        });

        if (!orderItem)
          throw new Error(`Order item ${item.orderItemId} not found`);

        // Tính toán refundAmount (number)
        const refundAmountNumber =
          item.quantity * orderItem.book.sellerPrice;

        return {
          orderItemId: item.orderItemId,
          quantity: item.quantity,
          // SỬA LỖI 2: 'null' được đổi thành 'undefined' để khớp với 'reason?: ReturnReason'
          reason: item.reason ?? undefined,
          // SỬA LỖI 2: 'number' được đổi thành 'string' để khớp với 'type: "numeric"'
          refundAmount: String(refundAmountNumber),
        };
      }),
    );

    const totalRefundAmount = returnItems.reduce(
      // SỬA LỖI 1: Chuyển 'string' về 'Number' để tính tổng
      (total, item) => total + Number(item.refundAmount),
      0,
    );

    const returnRequestSaved = this.returnRequestRepo.create({
      orderId: dto.orderId,
      userId: user.id,
      status: ReturnStatus.PENDING,
      customerNote: dto.customerNote, // <--- ĐÃ SỬA
      totalRefundAmount: String(totalRefundAmount),
    });

    // Lệnh .save() này sẽ hoạt động vì 'item' đã có kiểu đúng
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
}
