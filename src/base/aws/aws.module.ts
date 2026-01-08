import { Global, Module } from '@nestjs/common';
import { MinioService } from '@/base/aws/aws.service';

@Global()
@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class AwsModule {}
