import { IsEnum, IsInt, IsString, IsUUID } from 'class-validator';
import { RentalType } from '@/modules/ecommerce/enums/product.enum';

export class RentalItemDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  bookId: string;

  @IsString()
  unitPrice: string;

  @IsInt()
  quantity: number;

  @IsString()
  @IsEnum(RentalType)
  rentalType: RentalType;

  @IsString()
  subtotal: string;

  @IsString()
  rentStart: string;

  @IsString()
  rentDue?: string;
}

export class RentalItemListDto {}
