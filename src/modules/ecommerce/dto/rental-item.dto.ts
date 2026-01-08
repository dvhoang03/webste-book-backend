import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { RentalType } from '@/modules/ecommerce/enums/product.enum';
import { BaseListDto } from '@/base/service/base-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RentalItemDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  bookId: string;

  @IsOptional()
  @IsString()
  state?: string; // tình trạng sách khi thuê/trả

  @IsInt()
  quantity: number;

  @IsString()
  @IsEnum(RentalType)
  rentalType: RentalType;

  @IsString()
  rentStart: Date;

  @IsString()
  rentDue: Date;
}

export class RentalItemListDto extends BaseListDto {
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
      'Trường lọc [\'orderId\']. Ví dụ: {"isActive": true} hoặc query: filter[isActive]=true',

    example: {},
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return [];
  }
  allowSearch() {
    return [];
  }
  allowFilter() {
    return ['orderId'];
  }
  alias() {
    return 'rentalItem';
  }
  maxLimit() {
    return 100;
  }
}
