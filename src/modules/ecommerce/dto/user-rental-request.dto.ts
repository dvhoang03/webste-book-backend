// src/modules/ecommerce/dto/create-rental-return.dto.ts

import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { Column } from 'typeorm';
import { ShippingMethod } from '@/modules/ecommerce/enums/shipping.enum';

export class UserCreateRentalReturnDto {
  @IsUUID('4')
  @IsNotEmpty()
  orderId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @IsNotEmpty()
  rentalItemIds: string[]; // Tương ứng với 'returnedItems[]' bạn yêu cầu

  @IsUUID('4')
  @IsNotEmpty()
  addressId: string;

  @IsString()
  @IsOptional()
  customerNote?: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string; // Mã vận đơn (nếu khách tự gửi)

  @IsOptional()
  @IsEnum(ShippingMethod)
  shippingMethod?: ShippingMethod;
}
