import {
  ApiHideProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BaseListDto } from '@/base/service/base-list.dto';

export class ReviewDto {
  @ApiHideProperty()
  @IsUUID()
  @IsOptional()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  bookId: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}

export class CreateReviewDto extends ReviewDto {}

export class UpdateReviewDto extends PartialType(ReviewDto) {}

export class ReviewListDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description:
      'Sort theo các cột cho phép [createdAt, rating]. Ví dụ: "createdAt:desc,email:asc"',
    example: '',
  })
  declare sort?: string;

  @ApiPropertyOptional({
    description: 'Từ khoá tìm kiếm ',
    example: '',
  })
  declare q?: string;

  @ApiPropertyOptional({
    description: 'Các cột áp dụng tìm kiếm ',
    isArray: true,
    enum: [],
    example: [],
  })
  declare searchFields?: string[];

  @ApiPropertyOptional({
    description:
      "Cho phép lọc theo ['userId', 'bookId', 'rating']. Ví dụ: {\"isActive\": true} hoặc query: filter[isActive]=true",

    example: {},
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['createdAt', 'rating'];
  }
  allowSearch() {
    return [];
  }
  allowFilter() {
    return ['userId', 'bookId', 'rating'];
  }
  alias() {
    return 'review';
  }
  maxLimit() {
    return 100;
  }
}
