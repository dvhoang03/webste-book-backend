import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ReturnReason } from '@/modules/ecommerce/enums/return.enum';
import { Type } from 'class-transformer';

export class ItemReturn {
  @IsUUID(undefined, { each: true })
  orderItemId: string;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  @IsEnum(ReturnReason)
  reason?: ReturnReason;
}

export class UserReturnRequestDto {
  @IsUUID()
  orderId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemReturn)
  itemsReturn: ItemReturn[];

  @IsOptional()
  @IsString()
  customerNote?: string;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
