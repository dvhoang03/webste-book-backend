import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { config } from '@/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from '@/base/mail/mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config.MAIL.HOST, // SMTP server
        port: config.MAIL.PORT,
        secure: config.MAIL.SECURE,
        auth: {
          user: config.MAIL.USER, // email gửi
          pass: config.MAIL.PASS, // mật khẩu ứng dụng (app password)
        },
      },
      template: {
        dir: join(process.cwd(), 'src/base/mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
