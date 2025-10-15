import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

export enum PaymentTargetType {
  ORDER = 'ORDER',
  RENTAL = 'RENTAL',
}

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  EWALLET = 'EWALLET',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
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

  @Column({ type: 'text' })
  targetType: PaymentTargetType;

  @Column({ type: 'uuid' })
  targetId: string; // id của Order hoặc Rental

  @Column({ type: 'text' })
  method: PaymentMethod;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'text', default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
