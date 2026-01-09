// src/modules/ecommerce/service/user-rental-return.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm';
import { RentalReturn } from '@/modules/entity/rental-return.entity';
import { RentalItem } from '@/modules/entity/rental-item.entity';
import { Order } from '@/modules/entity/order.entity';
import { Address } from '@/modules/entity/address.entity';
import { User } from '@/modules/entity/user.entity';
import { RentalReturnStatus } from '@/modules/ecommerce/enums/rental.enum';
import { UserCreateRentalReturnDto } from '@/modules/ecommerce/dto/user-rental-request.dto';

@Injectable()
export class UserRentalReturnService {
  constructor(
    @InjectRepository(RentalReturn)
    private readonly rentalReturnRepo: Repository<RentalReturn>,
    @InjectRepository(RentalItem)
    private readonly rentalItemRepo: Repository<RentalItem>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    private readonly entityManager: EntityManager, // Để chạy transaction
  ) {}

  /**
   * Tạo một phiếu yêu cầu trả sách thuê
   */
  async createRentalReturn(user: User, dto: UserCreateRentalReturnDto) {
    // 1. Xác thực đơn hàng và địa chỉ
    const [order, address] = await Promise.all([
      this.orderRepo.findOne({
        where: { id: dto.orderId, userId: user.id },
      }),
      this.addressRepo.findOne({
        where: { id: dto.addressId, userId: user.id },
      }),
    ]);

    if (!order) {
      throw new NotFoundException(
        'Không tìm thấy đơn hàng hoặc đơn hàng không thuộc về bạn.',
      );
    }
    if (!address) {
      throw new NotFoundException(
        'Không tìm thấy địa chỉ hoặc địa chỉ không thuộc về bạn.',
      );
    }

    // 2. Chạy tất cả các thao tác trong một giao dịch (transaction)
    // Điều này đảm bảo tính toàn vẹn dữ liệu
    return this.entityManager.transaction(async (transactionManager) => {
      const rentalItemRepo = transactionManager.getRepository(RentalItem);
      const rentalReturnRepo = transactionManager.getRepository(RentalReturn);

      // 3. Lấy và xác thực các sách thuê (RentalItem)
      const itemsToReturn = await rentalItemRepo.find({
        where: {
          id: In(dto.rentalItemIds),
          orderId: dto.orderId, // Đảm bảo các sách thuộc đúng đơn hàng
        },
        relations: ['book'],
      });

      // Kiểm tra nếu số lượng sách tìm thấy không khớp
      if (itemsToReturn.length !== dto.rentalItemIds.length) {
        throw new BadRequestException(
          'Một số sách thuê không hợp lệ hoặc không thuộc đơn hàng này.',
        );
      }

      // Kiểm tra xem có sách nào đã được trả trước đó chưa
      const alreadyReturnedItem = itemsToReturn.find(
        (item) => item.rentalReturnId !== null, // Giả định 'rentalReturnId' là FK
      );

      if (alreadyReturnedItem) {
        throw new BadRequestException(
          `Sách (ID: ${alreadyReturnedItem.id}) đã nằm trong một phiếu trả khác.`,
        );
      }

      // 4. Tính tổng số tiền cọc sẽ hoàn lại
      // (Giả định RentalItem có trường 'rentalDeposit' kiểu string)
      const totalRefundAmount = itemsToReturn.reduce(
        (total, item) => total + Number(item.book.rentDeposit) * item.quantity,
        0,
      );

      // 5. Tạo phiếu trả (RentalReturn)
      const newRentalReturn = rentalReturnRepo.create({
        orderId: dto.orderId,
        userId: user.id,
        addressId: dto.addressId,
        status: RentalReturnStatus.PENDING, // Trạng thái mặc định
        customerNote: dto.customerNote,
        trackingNumber: dto.trackingNumber,
        refundAmount: totalRefundAmount, // Lưu tổng tiền cọc
      });

      const savedRentalReturn = await rentalReturnRepo.save(newRentalReturn);

      // 6. Cập nhật các sách thuê (RentalItem) để liên kết với phiếu trả mới
      // Đây là cách TypeORM xử lý quan hệ One-to-Many
      await rentalItemRepo.update(
        { id: In(dto.rentalItemIds) },
        { rentalReturnId: savedRentalReturn.id }, // Giả định FK là 'rentalReturnId'
      );

      // Trả về phiếu trả vừa tạo (chưa bao gồm quan hệ 'returnedItems')
      // Gán 'returnedItems' thủ công để controller có thể trả về ngay lập
      return savedRentalReturn;
    });
  }
}
