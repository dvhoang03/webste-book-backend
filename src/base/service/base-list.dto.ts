// src/common/dto/base-list.dto.ts
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export abstract class BaseListDto {
  // ---------- Query fields ----------
  @ApiPropertyOptional({
    description: 'Chuỗi sort, ví dụ: "createdAt:desc,name:asc"',
    example: 'createdAt:desc,name:asc',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description:
      'Từ khóa tìm kiếm (ILIKE). Nếu FE không truyền searchFields, sẽ dùng mặc định do DTO định nghĩa.',
    example: 'linh',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description:
      'Danh sách field áp dụng tìm kiếm (sẽ intersect với whitelist của DTO). Có thể truyền "email,fullName".',
    isArray: true,
    type: String,
    example: ['email', 'fullName'],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return String(value)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  })
  searchFields?: string[];

  @ApiPropertyOptional({
    description:
      'Bộ lọc EQ/IN. Dán JSON: {"isActive":true,"id":[1,2]} hoặc dùng deepObject: filter[isActive]=true',
    type: String,
    example: '{"isActive": true}',
  })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (!value) return {};
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        throw new BadRequestException('Invalid JSON in "filter" query param');
      }
    }
    return value;
  })
  filter?: Record<string, any>;

  @ApiPropertyOptional({ example: 20, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  // ---------- Cấu hình/whitelist LẤY TỪ DTO CON ----------
  /** Các cột cho phép sort. Hãy override ở DTO con. */
  abstract allowSort(): string[];

  /** Các cột cho phép search (dùng khi FE không truyền searchFields). Hãy override ở DTO con. */
  abstract allowSearch(): string[];

  /** Các cột cho phép filter. Hãy override ở DTO con. */
  abstract allowFilter(): string[];

  /** Alias mặc định cho bảng trong QueryBuilder (nếu muốn). */
  alias(): string {
    return 't';
  }

  /** Giới hạn tối đa limit. */
  maxLimit(): number {
    return 100;
  }
}
