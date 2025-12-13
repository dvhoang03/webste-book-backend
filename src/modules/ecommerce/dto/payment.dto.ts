import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentStatus } from '@/modules/ecommerce/enums/order.enum';
import { PaymentMethod } from '@/modules/ecommerce/enums/payment.enum';

export class PaymentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  orderId: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsInt()
  amount: string;

  @IsString()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
