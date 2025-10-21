import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config, ConfigModule, ConfigService } from '@/config';
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
  RentalItem,
  Review,
  User,
} from '@/modules/entity';
import { Publisher } from '@/modules/entity/publisher.entity';
import { Shipping } from '@/modules/entity/shipping.entity';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.POSTGRES.HOST,
        port: Number(configService.POSTGRES.PORT),
        username: configService.POSTGRES.USER,
        password: configService.POSTGRES.PASSWORD,
        database: configService.POSTGRES.NAME,
        entities: [
          User,
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
          Publisher,
          Shipping,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class PostgresModule {}
