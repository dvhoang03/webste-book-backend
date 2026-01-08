import { Module } from '@nestjs/common';
import { ChatController } from '@/modules/chat/chat.controller';
import { ChatService } from '@/modules/chat/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '@/modules/entity/conversation.entity';
import { ChatMessage } from '@/modules/entity/chat-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, ChatMessage])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
