// --- return-request.entity.ts ---
// Entity cho "Phiếu Yêu Cầu Hoàn Tiền" (Hàng MUA)

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { ReturnItem } from './return-item.entity';
import {
  ReturnReason,
  ReturnStatus,
} from '@/modules/ecommerce/enums/return.enum';

@Entity({ name: 'return_requests' })
@Index(['orderId'], { unique: true }) // ✅ Đảm bảo 1 Order chỉ có 1 Request
@Index(['userId'])
export class ReturnRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true })
  orderId: string;

  // ✅ Quan hệ 1-1 với Order
  @OneToOne(() => Order, (order) => order.returnRequest, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.returnRequests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Chi tiết các món hàng MUA được trả
  @OneToMany(() => ReturnItem, (item) => item.returnRequest, { cascade: true })
  items: ReturnItem[];

  @Column({
    type: 'enum',
    enum: ReturnStatus,
    default: ReturnStatus.PENDING,
  })
  status: ReturnStatus;

  @Column({
    type: 'enum',
    enum: ReturnReason,
    nullable: true,
  })
  reason?: ReturnReason;

  @Column({ type: 'text', nullable: true })
  customerNote?: string;

  @Column({ type: 'text', nullable: true })
  adminNote?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  totalRefundAmount: string; // Tổng tiền hoàn lại cho các món hàng MUA

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
