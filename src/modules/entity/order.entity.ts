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
import { Address } from './address.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '@/modules/ecommerce/enums/order.enum';
import { RentalItem } from '@/modules/entity/rental-item.entity';
import { Shipping } from '@/modules/entity/shipping.entity';
import { Payment } from '@/modules/entity/payment.entity';
import { RentalType } from '@/modules/ecommerce/enums/product.enum';
import { ReturnRequest } from '@/modules/entity/return-request.entity';
import { RentalReturn } from '@/modules/entity/rental-return.entity';

@Entity({ name: 'orders' })
@Index(['userId'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (u) => u.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  addressId: string;

  @ManyToOne(() => Address, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @Column({ type: 'text', default: OrderStatus.PROCESSING })
  status: OrderStatus;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  totalAmount: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  totalRentAmount: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  depositAmount: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  discount: string;

  // --- Quan hệ 1-N ---
  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true })
  purchaseItems: OrderItem[];

  @OneToMany(() => RentalItem, (ri) => ri.order, { cascade: true })
  rentalItems: RentalItem[];

  // --- Quan hệ 1-1 với Payment ---
  @Column('uuid', { nullable: true })
  shippingId: string; // chỉ lưu ID của shipping

  // --- Quan hệ 1-1 với Shipping ---
  @OneToOne(() => Shipping, (shipping) => shipping.order, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'shippingId' })
  shipping: Shipping;

  // --- Quan hệ 1-1 với Payment ---
  @Column('uuid', { nullable: true })
  paymentId: string; // chỉ lưu ID của payment

  @OneToOne(() => Payment, (payment) => payment.order, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @Column({ type: 'text', nullable: true })
  rentalType: RentalType;

  @Column({ type: 'date', nullable: true })
  rentStart?: Date;

  @Column({ type: 'date', nullable: true })
  rentDue?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // --- CÁC TRƯỜNG MỚI ĐƯỢC THÊM (Quan hệ) ---

  // ✅ Dùng cho HOÀN TIỀN (Hàng MUA)
  @OneToOne(() => ReturnRequest, (rr) => rr.order)
  returnRequest: ReturnRequest;

  // ✅ Dùng cho TRẢ SÁCH (Hàng THUÊ)
  @OneToMany(() => RentalReturn, (rr) => rr.order)
  rentalReturns: RentalReturn[];
}
