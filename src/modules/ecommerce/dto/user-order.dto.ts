import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  RentalType,
  TransactionType,
} from '@/modules/ecommerce/enums/product.enum';
import { Type } from 'class-transformer';
import { OrderStatus } from '@/modules/ecommerce/enums/order.enum';
import { BaseListDto } from '@/base/service/base-list.dto';

export class Items {
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @IsUUID()
  bookId: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsOptional()
  @IsEnum(RentalType)
  rentalType?: RentalType;
}
export class UserOrderDto {
  @ValidateNested({ each: true })
  @Type(() => Items)
  items: Items[];

  @IsUUID()
  @IsNotEmpty()
  addressId: string;
}

export class OrderDto {
  @IsUUID()
  userId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  totalAmount: string;

  @IsString()
  totalRentalAmount: string;

  @IsString()
  depositAmount: string;

  @IsOptional()
  @IsString()
  discount: string;
}

// export class OrderListDto extends BaseListDto {
//
// }
