import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { StringValue } from 'ms';
dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const env = Object.assign({}, process.env);

export function isDev(): boolean {
  return env.NODE_ENV === 'dev';
}

@Injectable()
export class ConfigService {
  DOMAIN = env.DOMAIN || 'http://localhost:3000';

  POSTGRES = {
    HOST: isDev() ? 'localhost' : (env.DB_HOST ?? 'localhost'),
    PORT: Number(env.DB_PORT || '5432'),
    USER: env.DB_USER || 'admin',
    PASSWORD: env.PASSWORD || 'book123',
    NAME: env.NAME || 'book',
  };

  MAIL = {
    HOST: env.MAIL_HOST,
    PORT: Number(env.MAIL_PORT || '587'),
    SECURE: false,
    REQUIRE_TLS: Boolean(env.MAIL_REQUIRE_TLS || 'false'),
    USER: env.MAIL_AUTH_USER || 'duongviethoang240803@gmail.com',
    PASS: env.MAIL_AUTH_PASS || 'ysabefmvnwaibxcp',
  };

  REDIS = {
    HOST: isDev() ? 'localhost' : (env.REDIS_HOST ?? 'localhost'),
    PORT: Number(env.REDIS_PORT || '6379'),
  };

  MINIO = {
    HOST: isDev() ? 'localhost' : (env.MINIO_HOST ?? 'localhost'),
    PORT: Number(env.MINIO_PORT || '9000'),
    USE_SSL: false,
    ACCESS_KEY: env.MINIO_ACCCESS_KEY || 'admin',
    SECRET_KEY: env.MINIO_SECRET_KEY || 'admin',
    BUCKET: env.MINIO_BUCKET || 'book',
    expose: (path: string) => {
      return `${config.MINIO.USE_SSL ? 'https' : 'http'}://${config.MINIO.HOST}:${config.MINIO.PORT}/${config.MINIO.BUCKET}/${path}`;
    },
  };

  JWT = {
    SECRET: env.JWT_ACCESS_SECRET ?? 'hoang',
    EXPIRES: (env.JWT_ACCESS_TTL ?? '1d') as StringValue,
    REFRESH_SECRET: env.JWT_REFRESH_SECRET ?? 'duongviethoang',
    REFRESH_EXPIRES: (env.JWT_REFRESH_TTL ?? '7d') as StringValue,
  };

  CACHE_LOCK_LONG_TIMEOUT = 30 * 60 * 1000;
  VNPAY = {
    VNP_TMN_CODE: env.VNP_TMNCODE || '',
    VNP_HASH_SECRET: env.VNP_HASHSECRET ?? '',
    VNP_URL: env.VNP_URL ?? '',
    VNP_CHECK_TRANSACTION: env.VNP_CHECK_TRANSACTION ?? '',
    VNP_RETURN_URL: env.VNP_RETURN_URL ?? '',
  };
  API_KEY_CHATBOT = env.API_KEY_CHATBOT || '';
  GOOGLE_API_KEY = env.GOOGLE_API_KEY || '';
  CHAT_BOT_URL = isDev()
    ? 'http://localhost:8000/chat'
    : env.CHAT_BOT_URL || '';
}

export const config = new ConfigService();
