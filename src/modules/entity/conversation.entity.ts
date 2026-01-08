import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/modules/entity/user.entity';
import { ChatMessage } from '@/modules/entity/chat-message.entity';

@Entity({ name: 'conversations' })
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.conversations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.conversation)
  chatMessages: ChatMessage[];

  @Column()
  sessionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
