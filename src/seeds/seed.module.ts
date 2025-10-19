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
  Rental,
  RentalItem,
  Review,
  User,
} from '@/modules/entity';
import { SeedService } from '@/seeds/seed.service';
import { config, ConfigModule, ConfigService } from '@/config';
import { Publisher } from '@/modules/entity/publisher.entity';

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
          Publisher,
          Rental,
          RentalItem,
          Review,
          User,
        ],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([
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
      Publisher,
      Rental,
      RentalItem,
      Review,
      User,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
