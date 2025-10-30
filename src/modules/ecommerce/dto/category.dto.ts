import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BaseListDto } from '@/base/service/base-list.dto';

export class CategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUUID()
  parentId: string;
}

export class CreateCategoryDto extends CategoryDto {}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class ListCategoryDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description: 'Sort theo các cột cho phép[name]. Ví dụ: "name:asc"',
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
      'Cho phép lọc theo trường [parentId]. Ví dụ: {"isActive": true} hoặc query: filter[isActive]=true',

    example: { parentId: 'hgg' },
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['name'];
  }
  allowSearch() {
    return [''];
  }
  allowFilter() {
    return ['parentId'];
  }
  alias() {
    return 'category';
  }
  maxLimit() {
    return 100;
  }
}
