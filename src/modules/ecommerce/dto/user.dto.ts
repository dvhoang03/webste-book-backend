import { BaseListDto } from '@/base/service/base-list.dto';
import {
  ApiHideProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsEmailUnique } from '@/modules/ecommerce/custom-validate/unique-email.validate';
import { Role } from '@/modules/user/user.enum';
import { GenerateAndSetPath } from '@/base/validators/validators.transformer';
import { Expose } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsEmailUnique()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsString()
  @GenerateAndSetPath('photoPath')
  @Expose()
  photoUrl?: string;

  @IsOptional()
  @ApiHideProperty()
  @Expose()
  photoPath?: string;

  @IsNotEmpty()
  @IsString()
  @GenerateAndSetPath('thumbnailPath')
  @Expose()
  thumbnailUrl?: string;

  @IsOptional()
  @ApiHideProperty()
  @Expose()
  thumbnailPath?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserListDto extends BaseListDto {
  // Chỉ override metadata Swagger, KHÔNG thay đổi logic/transform từ BaseListDto
  @ApiPropertyOptional({
    description:
      'Sort theo các cột cho phép. Ví dụ: "createdAt:desc,email:asc"',
    example: 'createdAt:desc,email:asc',
  })
  declare sort?: string;

  @ApiPropertyOptional({
    description:
      'Từ khoá tìm kiếm (áp dụng mặc định lên email, fullName nếu không truyền searchFields)',
    example: 'alloooo',
  })
  declare q?: string;

  @ApiPropertyOptional({
    description:
      'Các cột áp dụng tìm kiếm (nếu không truyền sẽ mặc định: email, fullName)',
    isArray: true,
    enum: ['email', 'fullName', 'phone'],
    example: ['email', 'fullName'],
  })
  declare searchFields?: string[];

  @ApiPropertyOptional({
    description:
      'Bộ lọc EQ/IN. Ví dụ: {"isActive": true} hoặc query: filter[isActive]=true',
    example: { isActive: true },
  })
  declare filter?: Record<string, any>;

  // --------- CẤU HÌNH/WLIST CHO SERVICE ĐỌC TỪ DTO ---------
  allowSort() {
    return ['email', 'fullName', 'isActive', 'createdAt', 'updatedAt'];
  }
  allowSearch() {
    return ['email', 'fullName'];
  }
  allowFilter() {
    return ['email', 'fullName', 'role', 'isActive', 'createdAt'];
  }
  alias() {
    return 'user';
  }
  maxLimit() {
    return 100;
  }
}
