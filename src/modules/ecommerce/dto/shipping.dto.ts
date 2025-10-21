import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ShippingStatus } from '@/modules/entity/shipping.entity';
import { Column } from 'typeorm';

export class ShippingDto {
  @IsUUID()
  addressId: string;

  @IsUUID()
  orderId: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  carrier?: string; // Đơn vị vận chuyển (e.g., GHTK, Viettel Post)

  @IsString()
  @IsEnum(ShippingStatus)
  status: ShippingStatus;

  @IsOptional()
  @IsString()
  shippingFee?: string;

  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: Date; // Ngày dự kiến giao
}
