import {
  ApiHideProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import {
  RentalType,
  TransactionType,
} from '@/modules/ecommerce/enums/product.enum';
import { BaseListDto } from '@/base/service/base-list.dto';

export class CartDto {
  @ApiHideProperty()
  @IsOptional()
  @IsUUID()
  userId: string;
}

export class CartItemDto extends CartDto {
  @ApiHideProperty()
  @IsOptional()
  @IsUUID()
  cartId: string;

  @IsNotEmpty()
  @IsUUID()
  bookId: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsOptional()
  @IsEnum(RentalType)
  rentalType?: RentalType;
}

export class CreateCartItemDto extends CartItemDto {}

export class UpdateCartItemDto extends PartialType(CartItemDto) {}

export class CartItemListDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description:
      'Sort theo các cột cho phép[quantity, createdAt]. Ví dụ: "name:asc"',
    example: '',
  })
  declare sort?: string;

  @ApiPropertyOptional({
    description: 'Từ khoá tìm kiếm ',
    example: '',
  })
  declare q?: string;

  @ApiPropertyOptional({
    description: 'Các cột áp dụng tìm kiếm [] ',
    isArray: true,
    enum: [],
    example: [],
  })
  declare searchFields?: string[];

  @ApiPropertyOptional({
    description:
      "Cho phép lọc theo truong ['type', 'userId', 'bookId']. Ví dụ: {\"isActive\": true} hoặc query: filter[isActive]=true",

    example: {},
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['quantity', 'createdAt'];
  }
  allowSearch() {
    return [];
  }
  allowFilter() {
    return ['type', 'userId', 'bookId'];
  }
  alias() {
    return 'cartItem';
  }
  maxLimit() {
    return 100;
  }
}
