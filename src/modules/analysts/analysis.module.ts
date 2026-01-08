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
  RentalItem,
  Review,
  User,
} from '@/modules/entity';
import { Publisher } from '@/modules/entity/publisher.entity';
import { Shipping } from '@/modules/entity/shipping.entity';
import { RentalReturn } from '@/modules/entity/rental-return.entity';
import { ReturnRequest } from '@/modules/entity/return-request.entity';
import { ReturnItem } from '@/modules/entity/return-item.entity';
import { Policy } from '@/modules/entity/policy.entity';
import { Conversation } from '@/modules/entity/conversation.entity';
import { ChatMessage } from '@/modules/entity/chat-message.entity';
import { Banner } from '@/modules/entity/banner.entity';
import { AnalysisService } from '@/modules/analysts/service/analysis.service';
import { AnalysisController } from '@/modules/analysts/controller/analysis.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Book,
      Address,
      Author,
      Review,
      Publisher,
      Cart,
      CartItem,
      Order,
      OrderItem,
      RentalItem,
      Payment,
      BookCategory,
      BookAuthor,
      Shipping,
      Category,
      RentalReturn,
      ReturnRequest,
      ReturnItem,
      Policy,
      Conversation,
      ChatMessage,
      Banner,
    ]),
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
