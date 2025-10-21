import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Address } from './address.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '@/modules/ecommerce/enums/order.enum';
import { RentalItem } from '@/modules/entity/rental-item.entity';
import { Shipping } from '@/modules/entity/shipping.entity';

@Entity({ name: 'orders' })
@Index(['userId'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (u) => u.orders, { onDelete: 'RESTRICT' })
  user: User;

  @ManyToOne(() => Address, { onDelete: 'RESTRICT' })
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

  ///quan he
  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true })
  purchaseItems: OrderItem[];

  @OneToMany(() => RentalItem, (ri) => ri.order, { cascade: true })
  rentalItems: RentalItem[];

  @OneToOne(() => Shipping, (shipping) => shipping.order, { cascade: true })
  shipping: Shipping;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
