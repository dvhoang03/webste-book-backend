// src/modules/ecommerce/dto/create-rental-return.dto.ts

import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ArrayMinSize,
} from 'class-validator';

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
}
