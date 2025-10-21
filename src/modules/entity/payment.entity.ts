import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { PaymentStatus } from '@/modules/ecommerce/enums/order.enum';

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  EWALLET = 'EWALLET',
}

@Entity({ name: 'payments' })
@Index(['userId', 'targetType', 'targetId'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (u) => u.payments, { onDelete: 'SET NULL' })
  user: User;

  @Column({ type: 'uuid' })
  orderId: string; // id của Order hoặc Rental

  @Column({ type: 'text', default: PaymentMethod.BANK_TRANSFER })
  method: PaymentMethod;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'text', default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
