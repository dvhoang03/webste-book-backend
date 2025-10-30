import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { GenerateAndSetPath } from '@/base/validators/validators.transformer';
import { Expose } from 'class-transformer';
import {
  ApiHideProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import { BaseListDto } from '@/base/service/base-list.dto';
import { IsSkuUnique } from '@/modules/ecommerce/custom-validate/sku-product-unique.validate';
import { BookStatus } from '@/modules/ecommerce/enums/product.enum';

export class BookDto {
  @IsString()
  @IsSkuUnique()
  sku: string;

  @IsString()
  @IsEnum(BookStatus)
  status: BookStatus;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  publisherId?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsNotEmpty()
  @IsInt()
  stockQty: number;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  publishedAt?: string;

  @IsNotEmpty()
  @IsString()
  @GenerateAndSetPath('photoPath')
  @Expose()
  photoUrl: string;

  @IsOptional()
  @ApiHideProperty()
  @Expose()
  photoPath?: string;

  @IsNotEmpty()
  @IsString()
  @GenerateAndSetPath('thumbnailPath')
  @Expose()
  thumbnailUrl: string;

  @IsOptional()
  @ApiHideProperty()
  @Expose()
  thumbnailPath?: string;

  @IsNotEmpty()
  @IsArray()
  @GenerateAndSetPath('mediaPaths', { each: true })
  @Expose()
  mediaUrls: string[];

  @IsOptional()
  @ApiHideProperty()
  @Expose()
  mediaPaths?: string[];

  // Giá bán và thuê
  @IsOptional()
  @IsNumberString()
  sellerPrice?: string;

  @IsOptional()
  @IsNumberString()
  rentPricePerDay?: string;

  @IsOptional()
  @IsNumberString()
  rentPenaltyPerDay?: string;

  @IsOptional()
  @IsNumberString()
  rentPricePerWeek?: string;

  @IsOptional()
  @IsNumberString()
  rentPenaltyPerWeek?: string;

  @IsOptional()
  @IsNumberString()
  rentPricePerMonth?: string;

  @IsOptional()
  @IsNumberString()
  rentPenaltyPerMonth?: string;

  // Quan hệ (chỉ chứa ID)
  // @IsOptional()
  // @IsArray()
  // @IsUUID('all', { each: true })
  // authorIds?: string[];
  //
  // @IsOptional()
  // @IsArray()
  // @IsUUID('all', { each: true })
  // categoryIds?: string[];
  //
  // @IsOptional()
  // @IsArray()
  // @IsUUID('all', { each: true })
  // imageIds?: string[];
}

// ---------------------
// UPDATE DTO
// ---------------------
export class CreateBookDto extends BookDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  categoryIds: string[];

  @IsArray()
  @IsUUID(undefined, { each: true })
  authorIds: string[];
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}

export class BookListDto extends BaseListDto {
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

    example: { 'bookCategory.categoryId': 'vi' },
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['title', 'description', 'publisher', 'publishedAt'];
  }
  allowSearch() {
    return ['title', 'description'];
  }
  allowFilter() {
    const bookCols = ['status', 'publisherId', 'language', 'stockQty'];

    // ✅ Các cột từ bảng quan hệ (dùng alias đã định nghĩa ở Bước 1)
    const relationCols = [
      'bookAuthor.authorId', // Lọc theo ID tác giả
      'bookCategory.categoryId', // Lọc theo ID danh mục
    ];
    return [...bookCols, ...relationCols];
  }
  alias() {
    return 'book';
  }
  maxLimit() {
    return 100;
  }
}
