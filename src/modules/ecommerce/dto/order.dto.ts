import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from '@/modules/ecommerce/enums/order.enum';
import { BaseListDto } from '@/base/service/base-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrderDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  addressId?: string;

  @IsUUID()
  shippingId?: string;

  @IsUUID()
  paymentId?: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  totalAmount: number;

  @IsString()
  totalRentalAmount: number;

  @IsOptional()
  @IsString()
  depositAmount?: number;

  @IsOptional()
  @IsString()
  discount?: number;
}

export class ListOrderDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description:
      'Sort theo các cột [createdAt, totalAmount]. Ví dụ: "createdAt:desc,email:asc"',
    example: 'createdAt:desc,email:asc',
  })
  declare sort?: string;

  @ApiPropertyOptional({
    description: 'Từ khoá tìm kiếm',
    example: '',
  })
  declare q?: string;

  @ApiPropertyOptional({
    description: 'Các cột áp dụng tìm kiếm []',
    isArray: true,
    enum: [],
    example: [],
  })
  declare searchFields?: string[];

  @ApiPropertyOptional({
    description:
      'Cho phép lọc theo[userId, addressId, status]. Ví dụ: {"isActive": true} hoặc query: filter[isActive]=true',

    example: { language: 'vi' },
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['createdAt', 'totalAmount'];
  }
  allowSearch() {
    return [];
  }
  allowFilter() {
    return ['userId', 'addressId', 'status'];
  }
  alias() {
    return 'order';
  }
  maxLimit() {
    return 100;
  }
}
