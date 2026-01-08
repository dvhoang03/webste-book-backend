// src/common/logger/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as log4js from 'log4js';
import { log4jsConfig } from './log4js.config';
import { Logger } from 'log4js';

log4js.configure(log4jsConfig);

@Injectable()
export class LoggingService implements LoggerService {
  private logger = log4js.getLogger();
  private alias?: string;

  constructor() {
    // Không để alias trong constructor DI
  }

  private formatMessage(message: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.alias ? `[${this.alias}] ${message}` : message;
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(this.formatMessage(message), ...optionalParams);
  }

  info(message: any, ...optionalParams: any[]) {
    this.logger.info(this.formatMessage(message), ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(this.formatMessage(message), ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(this.formatMessage(message), ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(this.formatMessage(message), ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logger.trace(this.formatMessage(message), ...optionalParams);
  }
  // Cho phép tạo logger riêng theo category
  getCategory(category: string) {
    const instance = new LoggingService();
    instance.alias = category;
    instance.logger = log4js.getLogger(category);
    return instance;
  }
}
