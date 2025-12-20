// --- rental-return.entity.ts ---
// Entity cho "Phiếu Trả Sách Thuê"

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { RentalItem } from './rental-item.entity';
import { RentalReturnStatus } from '@/modules/ecommerce/enums/rental.enum';
import { Address } from '@/modules/entity/address.entity';
import { ShippingMethod } from '@/modules/ecommerce/enums/shipping.enum';

@Entity({ name: 'rental_returns' })
@Index(['orderId'])
@Index(['userId'])
export class RentalReturn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  orderId: string;

  // ✅ Một Order có thể có nhiều lần trả sách thuê (để xử lý ngoại lệ)
  @OneToOne(() => Order, (order) => order.rentalReturn, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.rentalReturns, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: RentalReturnStatus,
    default: RentalReturnStatus.PENDING,
  })
  status: RentalReturnStatus;

  @Column('uuid')
  addressId: string;

  @ManyToOne(() => Address, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @Column({ enum: ShippingMethod, default: ShippingMethod.SHOP_DELIVERY })
  shippingMethod: ShippingMethod;

  @Column({ type: 'text', nullable: true })
  trackingNumber?: string; // Mã vận đơn (nếu khách gửi bưu điện)

  @Column({ type: 'text', nullable: true })
  customerNote?: string;

  @Column({ type: 'text', nullable: true })
  adminNote?: string; // v.d: sách hỏng, trừ tiền cọc

  @Column({ type: 'timestamptz', nullable: true })
  receivedAt?: Date; // Ngày kho nhận được sách

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  refundAmount: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  overdueFee: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
    nullable: true,
  })
  totalPenalty: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
