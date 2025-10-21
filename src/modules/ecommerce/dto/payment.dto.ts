import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ShippingStatus } from '@/modules/entity/shipping.entity';
import { Column } from 'typeorm';
import { PaymentStatus } from '@/modules/ecommerce/enums/order.enum';

export class PaymentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  orderId: string;

  @IsInt()
  amount: string;

  @IsString()
  @IsEnum(PaymentStatus)
  status: ShippingStatus;
}
