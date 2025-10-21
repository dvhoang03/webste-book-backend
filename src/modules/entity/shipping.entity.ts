// shipping.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

// Bạn có thể tạo một enum riêng cho trạng thái vận chuyển
export enum ShippingStatus {
  PENDING = 'PENDING', // Chờ xử lý
  IN_TRANSIT = 'IN_TRANSIT', // Đang vận chuyển
  DELIVERED = 'DELIVERED', // Đã giao hàng
  FAILED = 'FAILED', // Giao hàng thất bại
}

@Entity({ name: 'shippings' })
export class Shipping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  addressId: string;

  @Column({ type: 'uuid' })
  orderId: string;

  // Liên kết ngược lại với Order
  @OneToOne(() => Order, (order) => order.shipping)
  @JoinColumn() // Đánh dấu đây là bên sở hữu quan hệ (sẽ có cột orderId)
  order: Order;

  @Column({ type: 'text', nullable: true })
  trackingNumber: string; // Mã vận đơn

  @Column({ type: 'text' })
  carrier: string; // Đơn vị vận chuyển (e.g., GHTK, Viettel Post)

  @Column({
    type: 'text',
    enum: ShippingStatus,
    default: ShippingStatus.PENDING,
  })
  status: ShippingStatus;

  // Chuyển shippingFee từ Order sang đây
  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  shippingFee: string;

  @Column({ type: 'timestamptz', nullable: true })
  estimatedDeliveryDate: Date; // Ngày dự kiến giao

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
