// shipping.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Expose } from 'class-transformer';
import { config } from '@/config';
import { Address } from '@/modules/entity/address.entity';

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

  @ManyToOne(() => Address, (address) => address.shipping)
  address: Address;

  @Column('uuid')
  addressId: string;

  // Liên kết ngược lại với Order
  @OneToOne(() => Order, (order) => order.shipping)
  order: Order;

  @Column({ type: 'text', nullable: true })
  trackingNumber?: string; // Mã vận đơn

  @Column({ type: 'text' })
  carrier?: string; // Đơn vị vận chuyển (e.g., GHTK, Viettel Post)

  @Column({
    type: 'text',
    enum: ShippingStatus,
    default: ShippingStatus.PENDING,
  })
  status: ShippingStatus;

  // Chuyển shippingFee từ Order sang đây
  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number | null) => value, // Khi ghi vào DB
      from: (value: string | null) => (value ? parseFloat(value) : 0), // Khi đọc từ DB
    },
  })
  shippingFee?: number;

  @Column({ type: 'timestamptz', nullable: true })
  estimatedDeliveryDate?: Date; // Ngày dự kiến giao

  @Column({ type: 'simple-array', nullable: true })
  mediaPaths?: string[];

  // ✅ Computed property trả về URL đầy đủ cho từng file
  @Expose()
  get mediaUrls(): string[] | undefined {
    if (!this.mediaPaths || this.mediaPaths.length === 0) {
      return undefined;
    }
    return this.mediaPaths.map((path) => config.MINIO.expose(path));
  }

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
