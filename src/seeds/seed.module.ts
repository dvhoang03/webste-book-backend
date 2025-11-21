import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Address,
  Author,
  Book,
  BookAuthor,
  BookCategory,
  Cart,
  CartItem,
  Category,
  Order,
  OrderItem,
  Payment,
  // Rental,
  RentalItem,
  Review,
  User,
} from '@/modules/entity';
import { SeedService } from '@/seeds/seed.service';
import { config, ConfigModule, ConfigService } from '@/config';
import { Publisher } from '@/modules/entity/publisher.entity';
import { PostgresModule } from '@/base/database/postgres/postgres.module';

@Module({
  imports: [ConfigModule, PostgresModule, TypeOrmModule.forFeature([User])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
