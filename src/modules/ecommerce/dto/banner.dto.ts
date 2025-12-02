import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenerateAndSetPath } from '@/base/validators/validators.transformer';
import { Expose } from 'class-transformer';
import {
  ApiHideProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import { BannerPosition } from '@/modules/ecommerce/enums/banner.enum';
import { BaseListDto } from '@/base/service/base-list.dto';

export class BannerDto {
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @GenerateAndSetPath('photoPath')
  @Expose()
  imageUrl: string;

  @IsOptional()
  @ApiHideProperty()
  @Expose()
  imagePath?: string;

  @IsString()
  link: string;

  @IsString()
  @IsEnum(BannerPosition)
  position: BannerPosition;

  @IsNumber()
  sortOrder: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  isActive: boolean;
}

export class CreateBannerDto extends BannerDto {}

export class UpdateBannerDto extends PartialType(BannerDto) {}

export class BannerListDto extends BaseListDto {
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
    enum: [],
    example: [],
  })
  declare searchFields?: string[];

  @ApiPropertyOptional({
    description:
      "Cho phép lọc theo ['publisher', 'publishedAt', 'language', 'status', 'bookAuthor.authorId': [],'bookCategory.categoryId': []  ]. Ví dụ: {\"isActive\": true} hoặc query: filter[isActive]=true",

    example: { 'bookCategory.categoryId': 'vi' },
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['createdAt', 'updatedAt', 'startDate', 'endDate', 'sortOrder'];
  }
  allowSearch() {
    return [];
  }
  allowFilter() {
    return ['position', 'isActive'];

    // return [...bookCols, ...relationCols];
  }
  alias() {
    return 'banner';
  }
  maxLimit() {
    return 100;
  }
}
