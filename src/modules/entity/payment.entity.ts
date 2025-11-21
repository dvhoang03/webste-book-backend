import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { PaymentStatus } from '@/modules/ecommerce/enums/order.enum';
import { Order } from '@/modules/entity/order.entity';

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  EWALLET = 'EWALLET',
}

@Entity({ name: 'payments' })
@Index(['userId'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @ManyToOne(() => User, (u) => u.payments, { onDelete: 'SET NULL' })
  user: User;

  // Quan hệ 1-1 ngược lại, không lưu khóa ngoại
  @OneToOne(() => Order, (order) => order.payment)
  order: Order;

  @Column({ nullable: true })
  transactionNo: string;

  @Column({ nullable: true })
  responseCode: string;

  @Column({ nullable: true })
  transactionStatus: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'text', default: PaymentStatus.PAYING })
  status: PaymentStatus;

  @Column('text', { nullable: true })
  rawData: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
