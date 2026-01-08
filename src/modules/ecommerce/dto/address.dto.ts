import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseListDto } from '@/base/service/base-list.dto';

export class AddressDto {
  @ApiHideProperty()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ example: 'Name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Phone', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Nhà riêng', required: false })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ example: 'Hà Nội', required: false })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty({ example: 'Quận Ba Đình', required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ example: 'Phường Kim Mã', required: false })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiProperty({ example: '123 Kim Mã', required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: '100000', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class CreateAddressDto extends AddressDto {}

export class UpdateAddressDto extends PartialType(AddressDto) {}

export class AddressListDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description:
      'Sort theo các cột [createAt]. Ví dụ: "createdAt:desc,email:asc"',
    example: '',
  })
  declare sort?: string;

  @ApiPropertyOptional({
    description: 'Từ khoá tìm kiếm ',
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
    description: 'Cho phép lọc theo các cột [] . Ví dụ: {"": true} hoặc query:',

    example: { language: 'vi' },
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['createAt'];
  }
  allowSearch() {
    return [];
  }
  allowFilter() {
    return ['userId'];
  }
  alias() {
    return 'address';
  }
  maxLimit() {
    return 100;
  }
}
