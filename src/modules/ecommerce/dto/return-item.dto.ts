import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';
import { ReturnReason } from '@/modules/ecommerce/enums/return.enum';
import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { BaseListDto } from '@/base/service/base-list.dto';

export class ReturnItemDto {
  @IsUUID()
  returnRequestId: string;

  @IsUUID()
  orderItemId: string;

  @IsNumber()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number; // Số lượng trả

  @IsEnum(ReturnReason)
  reason: ReturnReason;
}

export class CreateReturnItemDto extends ReturnItemDto {}

export class UpdateReturnItemDto extends PartialType(
  PickType(ReturnItemDto, ['quantity', 'reason']),
) {}

export class ReturnItemListDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description: 'Sort theo [quantity, refundAmount]. Ví dụ: "name:asc"',
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
      'Trường lọc [\'reason\']. Ví dụ: {"isActive": true} hoặc query: filter[isActive]=true',

    example: {},
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['refundAmount', 'quantity'];
  }
  allowSearch() {
    return [];
  }
  allowFilter() {
    return ['reason'];
  }
  alias() {
    return 'returnItem';
  }
  maxLimit() {
    return 100;
  }
}
