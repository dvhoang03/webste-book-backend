import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book, Order, Payment } from '@/modules/entity';
import { VnPayController } from '@/provider/vnpay/vnpay.controller';
import { VnPayService } from '@/provider/vnpay/vnpay.service';
import { HttpModule } from '@nestjs/axios';
import { config } from '@/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Payment, Book]),
    HttpModule.register({
      baseURL: config.VNPAY.VNP_CHECK_TRANSACTION,
    }),
  ],
  controllers: [VnPayController],
  providers: [VnPayService],
  exports: [VnPayService],
})
export class VnpayModule {}
