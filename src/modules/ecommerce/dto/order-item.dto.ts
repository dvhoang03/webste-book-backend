import { IsInt, IsString, IsUUID } from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  bookId: string;

  @IsString()
  unitPrice: string;

  @IsInt()
  quantity: number;

  @IsString()
  subtotal: string;
}
