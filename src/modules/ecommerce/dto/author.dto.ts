import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BaseListDto } from '@/base/service/base-list.dto';

export class AuthorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  bio: string;
}

export class CreateAuthorDto extends AuthorDto {}

export class UpdateAuthorDto extends PartialType(AuthorDto) {}

export class AuthorListDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description: 'Sort theo các cột cho phép. Ví dụ: "name:asc"',
    example: '',
  })
  declare sort?: string;

  @ApiPropertyOptional({
    description:
      "Từ khoá tìm kiếm (áp dụng mặc định lên 'title', 'description' nếu không truyền searchFields)",
    example: '',
  })
  declare q?: string;

  @ApiPropertyOptional({
    description:
      "Các cột áp dụng tìm kiếm (nếu không truyền sẽ mặc định: 'title', 'description')",
    isArray: true,
    enum: ['title', 'description'],
    example: ['title', 'description'],
  })
  declare searchFields?: string[];

  @ApiPropertyOptional({
    description:
      "Cho phép lọc theo Bộ lọc EQ/IN các trường lọc 'publisher', 'publishedAt', 'language'. Ví dụ: {\"isActive\": true} hoặc query: filter[isActive]=true",

    example: { language: 'vi' },
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
    return 'author';
  }
  maxLimit() {
    return 100;
  }
}
