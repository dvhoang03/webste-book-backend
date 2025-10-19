// src/seed.ts

import { NestFactory } from '@nestjs/core';
import { SeedService } from '@/seeds/seed.service';
import { SeedModule } from '@/seeds/seed.module';

async function bootstrap() {
  // Tạo một ứng dụng Nest độc lập, không lắng nghe request
  const app = await NestFactory.createApplicationContext(SeedModule);

  try {
    console.log('Starting the seeding process...');
    const seeder = app.get(SeedService);
    await seeder.seed();
    console.log('Seeding finished successfully.');
  } catch (error) {
    console.error('Seeding failed!', error);
  } finally {
    await app.close(); // Đảm bảo ứng dụng được đóng lại
  }
}

bootstrap();
