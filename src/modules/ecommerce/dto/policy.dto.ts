import { IsString } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BaseListDto } from '@/base/service/base-list.dto';
import {
  IsSlugUnique,
  IsUniqueSlugValidate,
} from '@/modules/ecommerce/custom-validate/unique-slug-policy.validate';

export class PolicyDto {
  @IsString()
  title: string;

  @IsString()
  @IsSlugUnique()
  slug: string;

  @IsString()
  category: string;

  @IsString()
  content: string;
}

export class CreatePolicyDto extends PolicyDto {}

export class UpdatePolicyDto extends PartialType(PolicyDto) {}

export class PolicyListDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description:
      'Sort theo các cột cho phép. Ví dụ: "createdAt:desc,email:asc"',
    example: 'createdAt:desc,email:asc',
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
      "Cho phép lọc theo ['publisher', 'publishedAt', 'language', 'status', 'bookAuthor.authorId': [],'bookCategory.categoryId': []  ]. Ví dụ: {\"isActive\": true} hoặc query: filter[isActive]=true",

    example: { slug: 'vi' },
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['createdAt', 'title', 'slug'];
  }
  allowSearch() {
    return ['title', 'content'];
  }
  allowFilter() {
    return ['title', 'slug', 'category'];
  }
  alias() {
    return 'policy';
  }
  maxLimit() {
    return 100;
  }
}
