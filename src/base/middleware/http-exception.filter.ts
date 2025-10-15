// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '@/base/logging/logging.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: LoggingService;
  constructor(private readonly loggingService: LoggingService) {
    this.logger = this.loggingService.getCategory('http-exception');
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const hostType = host.getType();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: (exceptionResponse as any).message || exception.message || null,
    };

    // Ghi log lỗi ở đây nếu cần
    this.logger.debug(exception.getStatus(), errorResponse);

    response.status(status).json(errorResponse);
  }
}
