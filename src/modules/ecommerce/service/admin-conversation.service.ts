import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base-service.service';
import { Conversation } from '@/modules/entity/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminConversationService extends BaseService<Conversation> {
  constructor(
    @InjectRepository(Conversation)
    protected conversationModel: Repository<Conversation>,
  ) {
    super(conversationModel);
  }
}
