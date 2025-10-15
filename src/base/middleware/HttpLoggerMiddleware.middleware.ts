// src/common/logger/http-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '@/base/logging/logging.service';
import chalk from 'chalk'; // Thêm màu sắc cho terminal

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger: LoggingService;

  constructor(logger: LoggingService) {
    this.logger = logger.getCategory('http');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    //log  khi response hoan tat
    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      // Đặt màu cho status code
      let colorizedStatus: string;
      if (statusCode >= 500) {
        colorizedStatus = chalk.red(statusCode.toString());
      } else if (statusCode >= 400) {
        colorizedStatus = chalk.yellow(statusCode.toString());
      } else if (statusCode >= 300) {
        colorizedStatus = chalk.cyan(statusCode.toString());
      } else {
        colorizedStatus = chalk.green(statusCode.toString());
      }

      const methodColor = chalk.blue(method.padEnd(6));
      const timeColor = chalk.gray(`${duration}ms`);

      // Chuẩn hoá format log
      const logMessage = `${methodColor} ${originalUrl} ${colorizedStatus} - ${timeColor}`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
