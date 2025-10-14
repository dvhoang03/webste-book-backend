import { Injectable } from '@nestjs/common';
import { config } from '@/config';
import { LoggingService } from '@/base/logging/logging.service';
import { Logger } from 'log4js';
import { RedisService } from '@/base/database/redis/redis.service';
import { MailService } from '@/base/mail/mail.service';
import { MinioService } from '@/base/aws/aws.service';

@Injectable()
export class AppService {
  private readonly logger: LoggingService;

  constructor(
    private readonly loggingService: LoggingService,
    private readonly redis: RedisService,
    private readonly mailService: MailService,
    private readonly minioService: MinioService,
  ) {
    this.logger = loggingService.getCategory(AppService.name);
  }

  async getHello(file: Express.Multer.File) {
    // await this.redis.setParse('hoang', { hello: 'sada' }, 1000000);
    // await this.mailService.sendUserComfirmation(
    //   'kien.tt@tinasoft.com.vn',
    //   'fhagsfhgaskfhjksahfjkshajkf',
    // );
    return await this.minioService.uploadFile(file);
  }
}
