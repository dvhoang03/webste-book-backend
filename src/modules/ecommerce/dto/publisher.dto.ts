import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BaseListDto } from '@/base/service/base-list.dto';

export class PublisherDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  website: string;

  @IsNotEmpty()
  @IsString()
  contactEmail: string;
}

export class CreatePublisherDto extends PublisherDto {}

export class UpdatePublisherDto extends PartialType(PublisherDto) {}

export class PublisherListDto extends BaseListDto {
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
    description: 'Các cột áp dụng tìm kiếm [name] ',
    isArray: true,
    enum: ['name'],
    example: [],
  })
  declare searchFields?: string[];

  @ApiPropertyOptional({
    description:
      'Cho phép lọc theo trường []. Ví dụ: {"isActive": true} hoặc query: filter[isActive]=true',

    example: {},
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['name'];
  }
  allowSearch() {
    return ['name'];
  }
  allowFilter() {
    return [];
  }
  alias() {
    return 'publisher';
  }
  maxLimit() {
    return 100;
  }
}
