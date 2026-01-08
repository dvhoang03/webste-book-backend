// src/modules/ecommerce/dto/create-return-item.dto.ts

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ReturnReason } from '@/modules/ecommerce/enums/return.enum';
import { Column } from 'typeorm';
import {
  ApiHideProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import { BaseListDto } from '@/base/service/base-list.dto';

export class ReturnRequestDto {
  @IsUUID('4')
  @IsNotEmpty()
  orderId: string; // ID của OrderItem (món hàng trong đơn hàng gốc)

  @IsOptional()
  @IsString()
  customerNote?: string;

  @IsOptional()
  @IsString()
  adminNote?: string;

  @IsOptional()
  @ApiHideProperty()
  totalRefundAmount?: number;

  @IsEnum(ReturnReason)
  @IsOptional()
  reason?: ReturnReason; // Lý do trả cho món hàng này
}

export class CreateReturnRequestDto extends ReturnRequestDto {}

export class UpdateReturnRequestDto extends PartialType(
  CreateReturnRequestDto,
) {}

export class ReturnItemListDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description: 'Sort theo [totalRefundAmount, createdAt]. Ví dụ: "name:asc"',
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
      "Trường lọc ['orderId', 'userId', 'status']. Ví dụ: {\"isActive\": true} hoặc query: filter[isActive]=true",

    example: {},
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['totalRefundAmount', 'createdAt'];
  }
  allowSearch() {
    return [];
  }
  allowFilter() {
    return ['orderId', 'userId', 'status'];
  }
  alias() {
    return 'returnItem';
  }
  maxLimit() {
    return 100;
  }
}
