import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis, { RedisCommander } from 'ioredis';
import _, { assign, isObject } from 'lodash';
import { config } from '@/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis & RedisCommander;
  private subscriber: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: config.REDIS.HOST,
      port: config.REDIS.PORT,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.subscriber = new Redis({
      host: config.REDIS.HOST,
      port: config.REDIS.PORT,
    });

    this.client.on('connect', () => console.log('✅ Redis connected'));
    this.client.on('error', (err) => console.error('❌ Redis error:', err));
  }

  async onModuleDestroy() {
    await this.client.quit();
    await this.subscriber.quit();
  }

  // ==========================
  // ⚡️ CACHE (with TTL)
  // ==========================
  // async setCache(key: string, value: any, ttlSeconds?: number): Promise<void> {
  //   const data = typeof value === 'string' ? value : JSON.stringify(value);
  //   if (ttlSeconds) {
  //     await this.client.set(key, data, 'EX', ttlSeconds);
  //   } else {
  //     await this.client.set(key, data);
  //   }
  // }

  async setParse(key: string, value: any, mexp: number = -1) {
    // debug('setCache', mexp, key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const setValue = isObject(value)
      ? Object.assign(value, { _cache: true })
      : value;
    return this.client.set(key, JSON.stringify(setValue), 'PX', mexp);
  }

  // async getParse<T = string>(key: string): Promise<T> {
  //   debug('getCache', key);
  //   const value = await this.store.get(key);
  //   return JSON.parse(value);
  // }

  async getParse<T = string>(key: string): Promise<T> {
    const value = await this.client.get(key);
    if (!value) {
      throw new BadRequestException('Not found in redis');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(value);
  }

  async getValueByKey<T = string | null>(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async delCache(key: string): Promise<void> {
    await this.client.del(key);
  }

  // ==========================
  // 🔔 PUB / SUB
  // ==========================
  async publish(channel: string, message: string) {
    await this.client.publish(channel, message);
  }

  async subscribe(channel: string, callback: (msg: string) => void) {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (_, message) => {
      callback(message);
    });
  }

  /**
   * kieemr tra key co tontaij ko
   * @param key cua value
   */
  async hasKey(key: string): Promise<boolean> {
    const exists = await this.client.exists(key);
    return exists === 1;
  }

  /**
   * setNx cho key and value
   * @param key
   * @param value
   * @param mexp
   */
  async setNx(
    key: string,
    value: string | number,
    mexp: number = -1,
  ): Promise<number | null> {
    const result = await this.client
      .pipeline()
      .setnx(key, value)
      .expire(key, mexp / 1000)
      .exec();

    // Kiểm tra nếu result không null/undefined
    return (result?.[0]?.[1] as number) ?? null;
  }

  async incrby(key: string, increment: string | number) {
    return await this.client.incrby(key, increment);
  }
}
