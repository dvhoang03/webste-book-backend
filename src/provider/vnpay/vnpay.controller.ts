import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiTagAndBearer } from '@/base/swagger/swagger.decorator';
import { VnPayService } from '@/provider/vnpay/vnpay.service';
import { SkipAuth } from '@/modules/auth/auth.decorator';
import { Response } from 'express';
import { LoggingService } from '@/base/logging/logging.service';

@ApiTagAndBearer('App/ VnPay')
@SkipAuth()
@Controller('payment')
export class VnPayController {
  private logger: LoggingService;
  constructor(
    private readonly vnPayService: VnPayService,
    private loggingService: LoggingService,
  ) {
    this.logger = loggingService.getCategory(VnPayController.name);
  }

  @Get('vnpay-ipn')
  async handleVnPayIpn(@Query() vnp_Params: any, @Res() res: Response) {
    const result = await this.vnPayService.handleIpn(vnp_Params);

    // Trả về kết quả cho VNPAY
    res.status(HttpStatus.OK).json(result);
  }

  // payment.controller.ts (thêm vào)

  @Get('vnpay-return')
  async handleVnPayReturn(@Query() vnp_Params: any, @Res() res: Response) {
    const isValid = this.vnPayService.validateChecksum(vnp_Params);

    // const frontEndSuccessUrl = this.configService.get<string>('FRONTEND_PAYMENT_SUCCESS_URL');
    // const frontEndFailedUrl = this.configService.get<string>('FRONTEND_PAYMENT_FAILED_URL');

    const orderId = vnp_Params['vnp_TxnRef']; // Đây là Payment.id

    if (isValid) {
      const responseCode = vnp_Params['vnp_ResponseCode'];
      if (responseCode === '00') {
        // Thành công
        // Chuyển hướng về trang success của Frontend
        // res.redirect(`${frontEndSuccessUrl}?orderId=${orderId}`);
        console.log('thanh toan success');
      } else {
        // Thất bại
        // res.redirect(`${frontEndFailedUrl}?orderId=${orderId}&code=${responseCode}`);
        console.log('thanh toan failed');
      }
    } else {
      // Checksum sai
      // res.redirect(`${frontEndFailedUrl}?orderId=${orderId}&code=97`);
      console.log('thanh toan failed do checksum');
    }
    res.redirect('https://www.facebook.com/angelordemonn');
  }
}
