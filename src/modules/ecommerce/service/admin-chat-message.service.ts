import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '@/modules/entity/chat-message.entity';

@Injectable()
export class AdminChatMessageService extends BaseService<ChatMessage> {
  constructor(
    @InjectRepository(ChatMessage)
    protected chatMessageModel: Repository<ChatMessage>,
  ) {
    super(chatMessageModel);
  }
}
