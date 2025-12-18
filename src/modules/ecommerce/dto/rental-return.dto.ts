import { IsOptional, IsString, IsUUID } from 'class-validator';
import {
  ApiHideProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { BaseListDto } from '@/base/service/base-list.dto';

export class RentalReturnDto {
  @IsUUID()
  orderId: string;

  @IsOptional()
  @ApiHideProperty()
  @IsUUID()
  userId?: string;

  @IsUUID()
  addressId: string;

  @IsOptional()
  @IsString()
  customerNote?: string;

  @IsOptional()
  @IsString()
  receivedAt?: Date;
}

export class CreateRentalReturnDto extends RentalReturnDto {}

export class UpdateRentalReturnDto extends PartialType(
  OmitType(RentalReturnDto, ['orderId']),
) {}

export class RentalReturnListDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description: 'Sort theo [createdAt, refundAmount]. Ví dụ: "name:asc"',
    example: '',
  })
  declare sort?: string;

  @ApiPropertyOptional({
    description: 'Từ khoá tìm kiếm ',
    example: '',
  })
  declare q?: string;

  @ApiPropertyOptional({
    description: 'Các cột tìm kiếm [] ',
    isArray: true,
    enum: [],
    example: [],
  })
  declare searchFields?: string[];

  @ApiPropertyOptional({
    description:
      "Trường lọc ['receivedAt', 'status', 'userId', 'orderId']. Ví dụ: {\"isActive\": true} hoặc query: filter[isActive]=true",

    example: {},
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['createdAt', 'refundAmount'];
  }
  allowSearch() {
    return [];
  }
  allowFilter() {
    return ['receivedAt', 'status', 'userId', 'orderId'];
  }
  alias() {
    return 'rentalReturn';
  }
  maxLimit() {
    return 100;
  }
}
