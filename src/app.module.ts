import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config, ConfigModule, ConfigService } from './config';
import { PostgresModule } from '@/base/database/postgres/postgres.module';
import { HttpLoggerMiddleware } from '@/base/middleware/HttpLoggerMiddleware.middleware';
import { LoggingModule } from '@/base/logging/logging.module';
import { RedisModule } from '@/base/database/redis/redis.module';
import { MailModule } from '@/base/mail/mail.module';
import { MinioService } from '@/base/aws/aws.service';
import { AwsModule } from '@/base/aws/aws.module';
import { EcommerceModule } from '@/modules/ecommerce/ecommerce.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/modules/auth/jwt/jwt.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ChatModule } from '@/modules/chat/chat.module';
import { AnalysisModule } from '@/modules/analysts/analysis.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // <-- Thêm dòng này

    ConfigModule,
    PostgresModule,
    LoggingModule,
    RedisModule,
    MailModule,
    AwsModule,

    AuthModule,

    EcommerceModule,
    UserModule,
    ChatModule,
    AnalysisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
