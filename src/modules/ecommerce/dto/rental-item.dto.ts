import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { RentalType } from '@/modules/ecommerce/enums/product.enum';

export class RentalItemDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  bookId: string;

  @IsOptional()
  @IsString()
  state?: string; // tình trạng sách khi thuê/trả

  @IsInt()
  quantity: number;

  @IsString()
  @IsEnum(RentalType)
  rentalType: RentalType;

  @IsString()
  rentStart: Date;

  @IsString()
  rentDue: Date;
}

export class RentalItemListDto {}
