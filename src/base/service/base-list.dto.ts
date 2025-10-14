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

export class BaseListDto {
  /**
   * Chuỗi sort, ví dụ: "name:asc,createdAt:desc"
   */
  @IsOptional()
  @IsString()
  sort?: string;

  /**
   * Từ khóa tìm kiếm toàn cục (ILIKE)
   */
  @IsOptional()
  @IsString()
  q?: string;

  /**
   * Danh sách field sẽ áp dụng tìm kiếm q
   */
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    // hỗ trợ "field1,field2"
    return String(value)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  })
  searchFields?: string[];

  /**
   * Lọc theo các trường trong entity
   * ví dụ: filter[id]=1&filter[name]=hoang
   * hoặc JSON: filter={"id":1,"name":"hoang"} (tùy FE gửi)
   */
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (!value) return {};
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        // fallback: parse kiểu querystring đã tách sẵn
        return {};
      }
    }
    return value;
  })
  filter?: Record<string, any>;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
}
