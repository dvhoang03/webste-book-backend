import { IsString } from 'class-validator';

export class VnpayDto {
  @IsString()
  ipAddr: string;

  @IsString()
  amount: number;

  @IsString()
  orderInfo: string;

  @IsString()
  orderType: string = 'other';

  @IsString()
  locale: string = 'vn';
}

export interface VnpayRequestDto {
  vnp_Version: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_Amount: number; // Số tiền (nhân 100)
  vnp_CurrCode: string;
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_Locale: string;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string;
  vnp_CreateDate: string;
}
