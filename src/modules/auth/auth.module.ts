import { Module } from '@nestjs/common';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { UserModule } from '@/modules/user/user.module';
import { JwtStrategy } from '@/modules/auth/jwt/jwt.strategy';
import { JwtUserStrategy } from '@/modules/auth/jwt-user/jwt-user.stategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/entity';
import { MailModule } from '@/base/mail/mail.module';
import { EcommerceModule } from '@/modules/ecommerce/ecommerce.module';
import { IsUniqueEmailValidate } from '@/modules/ecommerce/custom-validate/unique-email.validate';

@Module({
  imports: [
    UserModule,
    JwtModule,
    TypeOrmModule.forFeature([User]),
    MailModule,
    EcommerceModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtUserStrategy],
})
export class AuthModule {}
