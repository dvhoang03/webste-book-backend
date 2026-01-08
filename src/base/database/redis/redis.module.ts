import { Global, Module } from '@nestjs/common';
import { RedisService } from '@/base/database/redis/redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
