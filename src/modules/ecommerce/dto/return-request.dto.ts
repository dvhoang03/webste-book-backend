// src/modules/ecommerce/dto/create-return-item.dto.ts

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ReturnReason } from '@/modules/ecommerce/enums/return.enum';
import { Column } from 'typeorm';
import { ApiHideProperty, PartialType } from '@nestjs/swagger';

export class ReturnItemDto {
  @IsUUID('4')
  @IsNotEmpty()
  orderItemId: string; // ID của OrderItem (món hàng trong đơn hàng gốc)

  @IsNumber()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number; // Số lượng trả

  @IsOptional()
  @IsString()
  customerNote?: string;

  @IsOptional()
  @IsString()
  adminNote?: string;

  @IsOptional()
  @ApiHideProperty()
  totalRefundAmount?: string;

  @IsEnum(ReturnReason)
  @IsOptional()
  reason?: ReturnReason; // Lý do trả cho món hàng này
}

export class CreateReturnRequestDto extends ReturnItemDto {}

export class UpdateReturnRequestDto extends PartialType(
  CreateReturnRequestDto,
) {}
