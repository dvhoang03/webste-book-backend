import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserComfirmation(email: string, token: string) {
    const url = `https://your-domain.com/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác nhận tài đăng kí website book',
      template: './confirmation',
      context: {
        username: 'hoang',
        url,
      },
    });
  }

  async send(email: string, token: string) {
    const otp = token;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Xac nhận tài khoản của bạn.',
      template: './confirmation',
      context: {
        username: 'hoang',
        otp,
      },
    });
  }
}
