// --- return-item.entity.ts ---
// Entity cho "Chi Tiết Món Hàng Hoàn Tiền" (Chỉ hàng MUA)

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { ReturnRequest } from './return-request.entity';
import { OrderItem } from './order-item.entity';
import { ReturnReason } from '@/modules/ecommerce/enums/return.enum'; // ✅ Chỉ import OrderItem

@Entity({ name: 'return_items' })
@Index(['returnRequestId'])
@Index(['orderItemId'])
export class ReturnItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  returnRequestId: string;

  @ManyToOne(() => ReturnRequest, (req) => req.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'returnRequestId' })
  returnRequest: ReturnRequest;

  // ✅ Chỉ liên kết tới HÀNG MUA
  @Column('uuid')
  orderItemId: string;

  @ManyToOne(() => OrderItem, { onDelete: 'SET NULL' }) // Hoặc RESTRICT
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    type: 'enum',
    enum: ReturnReason,
    nullable: true,
  })
  reason?: ReturnReason;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  refundAmount: string;
}
