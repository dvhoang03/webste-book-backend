// common/services/vnpay.service.ts
import { Injectable } from '@nestjs/common';
import * as querystring from 'qs';
import * as crypto from 'crypto';
import * as moment from 'moment';
import { Payment } from '@/modules/entity/payment.entity';
import { config } from '@/config';
import { sortObject } from '@/provider/vnpay/vnpay.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, Order } from '@/modules/entity';
import {
  OrderStatus,
  PaymentStatus,
} from '@/modules/ecommerce/enums/order.enum';
import { firstValueFrom } from 'rxjs';
import { LoggingService } from '@/base/logging/logging.service';
import { HttpService } from '@nestjs/axios';
import { otp1 } from '@/base/util';
import { getStockKey } from '@/modules/ecommerce/service/user-create-order.service';
import { RedisService } from '@/base/database/redis/redis.service';

@Injectable()
export class VnPayService {
  private readonly vnp_TmnCode: string;
  private readonly vnp_HashSecret: string;
  private readonly vnp_Url: string;
  private readonly vnp_ReturnUrl: string;

  private readonly logger: LoggingService;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly loggingService: LoggingService,
    private readonly httpService: HttpService,
    private readonly cache: RedisService,
  ) {
    // Lấy config từ .env
    this.vnp_TmnCode = config.VNPAY.VNP_TMN_CODE;
    this.vnp_HashSecret = config.VNPAY.VNP_HASH_SECRET;
    this.vnp_Url = config.VNPAY.VNP_URL;
    this.vnp_ReturnUrl = config.VNPAY.VNP_RETURN_URL;
    this.logger = loggingService.getCategory(VnPayService.name);
    // this.vnp_IpnUrl = config.VNPAY.VNP_RETURN_URL; // Bạn cần URL này
  }

  createPaymentUrl(payment: Payment, ipAddr: string): string {
    const date = moment(payment.createdAt);
    const createDate = date.format('YYYYMMDDHHmmss');

    // --- BỔ SUNG THỜI GIAN HẾT HẠN ---
    // Ví dụ: 15 phút sau
    // Thời điểm hết hạn (15 phút sau)
    const expireDate = moment(date).add(30, 'minutes');
    const vnpExpireDate = expireDate.format('YYYYMMDDHHmmss');

    const orderId = payment.id; // <-- Rất quan trọng: Dùng Payment ID
    const amount = payment.amount * 100; // VNPAY yêu cầu nhân 100
    const orderInfo = `Thanh toan don hang ${payment.order.id}`;

    let vnp_Params: Record<string, any> = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = this.vnp_TmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId; // <-- Dùng Payment ID
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = 'other'; // Hoặc mã danh mục của bạn
    vnp_Params['vnp_Amount'] = amount;
    vnp_Params['vnp_ReturnUrl'] = this.vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = vnpExpireDate;

    // vnp_Params['vnp_BankCode'] = 'VNBANK'; // Tùy chọn

    // Sắp xếp params
    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const vnpUrl =
      this.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  }

  async handleIpn(
    vnp_Params: Record<string, any>,
  ): Promise<{ RspCode: string; Message: string }> {
    this.logger.debug('IPN_VNPAY', JSON.stringify(vnp_Params));
    if (!this.validateChecksum(vnp_Params)) {
      return { RspCode: '97', Message: 'Fail checksum' };
    }

    const paymentId = vnp_Params['vnp_TxnRef'] as string;
    const vnpAmount = parseInt(vnp_Params['vnp_Amount']) / 100;
    const responseCode = vnp_Params['vnp_ResponseCode'];
    const transactionStatus = vnp_Params['vnp_TransactionStatus'];

    // 1. Tìm Payment trong DB
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['order'], // Lấy kèm order
    });

    if (!payment) {
      return { RspCode: '01', Message: 'Order not found' };
    }

    // 2. Kiểm tra số tiền
    if (parseInt(payment.amount.toString()) !== vnpAmount) {
      return { RspCode: '04', Message: 'Invalid amount' };
    }

    // 3. Kiểm tra trạng thái (chỉ cập nhật nếu đang PAYING)
    if (payment.status !== PaymentStatus.PAYING) {
      // Nếu đã Success/Failed, coi như đã xử lý rồi
      return { RspCode: '02', Message: 'Order already confirmed' };
    }

    // --- Cập nhật trạng thái ---
    const isSuccess = responseCode === '00' && transactionStatus === '00';

    const order = await this.orderRepository.findOne({
      where: {
        id: payment.order.id,
      },
      relations: ['purchaseItems', 'rentalItems'],
    });

    if (isSuccess) {
      payment.status = PaymentStatus.PAID;
      order?.orderItems.map(async (orderItem) => {
        await this.bookRepository.decrement(
          { id: orderItem.bookId },
          'stockQty',
          -1 * orderItem.quantity,
        );
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      order?.rentalItems.map(async (orderItem) => {
        await this.bookRepository.decrement(
          { id: orderItem.bookId },
          'stockQty',
          -1 * orderItem.quantity,
        );
      });
      // Cập nhật Order status
      if (payment.order) {
        payment.order.status = OrderStatus.WAIT_FOR_DELIVERY; // Hoặc CONFIRMED
        await this.orderRepository.save(payment.order);
      }
    } else {
      payment.status = PaymentStatus.PAYMENT_ERROR;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      order?.orderItems.map(async (orderItem) => {
        await this.unLockProduct(
          orderItem.book,
          orderItem.quantity,
          this.logger,
        );
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      order?.rentalItems.map(async (orderItem) => {
        await this.unLockProduct(
          orderItem.book,
          orderItem.quantity,
          this.logger,
        );
      });
      // Cập nhật Order status
      if (payment.order) {
        payment.order.status = OrderStatus.PAYMENT_ERROR;
        await this.orderRepository.save(payment.order);
      }
    }

    // Lưu thông tin giao dịch VNPAY vào bản ghi Payment
    payment.transactionNo = vnp_Params['vnp_TransactionNo'];
    payment.responseCode = responseCode;
    payment.transactionStatus = transactionStatus;
    payment.rawData = JSON.stringify(vnp_Params); // Lưu lại toàn bộ raw data

    await this.paymentRepository.save(payment);

    // Trả về success cho VNPAY
    return { RspCode: '00', Message: 'Success' };
  }

  // Hàm xác thực chữ ký
  validateChecksum(vnp_Params: Record<string, any>): boolean {
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Xóa hash và hashType khỏi params
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed;
  }

  /**
   * Hàm này chỉ gọi API VNPAY, xác thực checksum và trả về data.
   * Nó không cập nhật CSDL.
   * @param payment
   * @returns Dữ liệu VNPAY trả về, hoặc null nếu có lỗi
   */
  async queryTransaction(
    payment: Payment,
  ): Promise<Record<string, any> | null> {
    const ipAddr = '42.114.64.164';

    const vnp_Params: any = {
      vnp_RequestId: otp1(),
      vnp_Version: '2.1.0',
      vnp_Command: 'querydr',
      vnp_TmnCode: this.vnp_TmnCode,
      vnp_TxnRef: payment.id,
      vnp_OrderInfo: `Truy van don hang ${payment.id}`,
      vnp_TransactionDate: moment(payment.createdAt).format('YYYYMMDDHHmmss'),
      vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
      vnp_IpAddr: ipAddr,
    };

    const dataSign = [
      vnp_Params.vnp_RequestId,
      vnp_Params.vnp_Version,
      vnp_Params.vnp_Command,
      vnp_Params.vnp_TmnCode,
      vnp_Params.vnp_TxnRef,
      vnp_Params.vnp_TransactionDate,
      vnp_Params.vnp_CreateDate,
      vnp_Params.vnp_IpAddr,
      vnp_Params.vnp_OrderInfo,
    ].join('|');

    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    vnp_Params.vnp_SecureHash = hmac
      .update(Buffer.from(dataSign, 'utf-8'))
      .digest('hex');

    try {
      const { data: responseData } = await firstValueFrom(
        this.httpService.request({
          method: 'post',
          headers: {
            'Content-Type': 'Application/json',
          },
          data: vnp_Params,
        }),
      );

      this.logger.debug(
        'DATA_RESPONSE_CHECK_TRANSACTION',
        JSON.stringify(responseData),
      );

      // Validate checksum của kết quả trả về
      if (!this.validateQueryResponseChecksum(responseData)) {
        this.logger.error(
          `QueryDR Invalid Checksum for ${payment.id}`,
          responseData,
        );
        return null; // <-- Trả về null nếu checksum sai
      }
      return responseData; // <-- Trả về dữ liệu gốc
    } catch (error) {
      this.logger.error(
        `HTTP Error while querying ${payment.id}`,
        error.message,
      );
      return null; // <-- Trả về null nếu có lỗi
    }
  }

  // --- CẬP NHẬT HÀM NÀY ĐỂ TRÁNH MUTATE OBJECT ---
  private validateQueryResponseChecksum(
    responseData: Record<string, any>,
  ): boolean {
    const secureHash = responseData.vnp_SecureHash;

    const data = [
      responseData.vnp_ResponseId,
      responseData.vnp_Command,
      responseData.vnp_ResponseCode,
      responseData.vnp_Message,
      responseData.vnp_TmnCode,
      responseData.vnp_TxnRef,
      responseData.vnp_Amount,
      responseData.vnp_BankCode,
      responseData.vnp_PayDate,
      responseData.vnp_TransactionNo,
      responseData.vnp_TransactionType,
      responseData.vnp_TransactionStatus,
      responseData.vnp_OrderInfo,
      responseData.vnp_PromotionCode || '',
      responseData.vnp_PromotionAmount || '',
    ].join('|');

    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');

    return secureHash === signed;
  }

  async unLockProduct(book: Book, quantity: number, log: LoggingService) {
    try {
      await this.cache.incrby(getStockKey(book.id), quantity);
    } catch (error) {
      log.error(error);
    }
  }
}
