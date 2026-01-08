import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from '@/base/swagger';
import { config } from '@/config';
import { LoggingService } from '@/base/logging/logging.service';
import * as cookieParser from 'cookie-parser';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { HttpExceptionFilter } from '@/base/middleware/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Dùng hàm này giúp cho url có thể sinh ra
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const logger = new LoggingService();
  app.useLogger(logger);
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1/');

  app.useGlobalFilters(new HttpExceptionFilter(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // tự bỏ field thừa
      forbidNonWhitelisted: true, // ném lỗi nếu có field thừa
      transform: true, // auto transform theo DTO
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
      // exceptionFactory: (errors) => {
      //   return new BadRequestException({
      //     message: 'Validation failed',
      //     errors: errors.map((e) => ({
      //       field: e.property,
      //       constraints: Object.values(e.constraints ?? {}),
      //     })),
      //   });
      // },
    }),
  );
  app.enableCors();
  initSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
  logger.log('apidoc: ', config.DOMAIN + '/apidoc');
}
bootstrap();
