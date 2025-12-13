import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Column } from 'typeorm';
import { GenerateAndSetPath } from '@/base/validators/validators.transformer';
import { Expose } from 'class-transformer';
import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ShippingStatus } from '@/modules/ecommerce/enums/order.enum';
import { ShippingMethod } from '@/modules/ecommerce/enums/shipping.enum';

export class ShippingDto {
  @IsUUID()
  orderId: string;

  @ApiHideProperty()
  @IsOptional()
  @IsUUID()
  addressId: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsEnum(ShippingMethod)
  shippingMethod?: ShippingMethod;

  @IsOptional()
  @IsString()
  carrier?: string; // Đơn vị vận chuyển (e.g., GHTK, Viettel Post)

  @IsString()
  @IsEnum(ShippingStatus)
  status: ShippingStatus;

  @IsOptional()
  @IsNumber()
  shippingFee?: number;

  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: string; // Ngày dự kiến giao

  @IsNotEmpty()
  @IsArray()
  @GenerateAndSetPath('mediaPaths', { each: true })
  @Expose()
  mediaUrls: string[];

  @IsOptional()
  @ApiHideProperty()
  @Expose()
  mediaPaths?: string[];
}

export class CreateShippingDto extends ShippingDto {}

export class UpdateShippingDto extends PartialType(
  OmitType(ShippingDto, ['addressId']),
) {}
