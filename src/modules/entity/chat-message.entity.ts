import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation } from '@/modules/entity/conversation.entity';
import { RoleChatMessage } from '@/modules/ecommerce/dto/chat-message.dto';

@Entity({ name: 'chat_messages' })
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  conversationId: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.chatMessages)
  conversation: Conversation;

  @Column({ enum: RoleChatMessage })
  role: RoleChatMessage;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
