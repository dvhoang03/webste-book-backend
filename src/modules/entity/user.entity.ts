import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '@/modules/user/user.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text', nullable: true })
  fullName?: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @Column({ type: 'text', default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // relations
  @OneToMany(() => Address, (a) => a.user)
  addresses: Address[];

  @OneToMany(() => Cart, (c) => c.user)
  carts: Cart[];

  @OneToMany(() => Order, (o) => o.user)
  orders: Order[];

  @OneToMany(() => Rental, (r) => r.user)
  rentals: Rental[];

  @OneToMany(() => Review, (r) => r.user)
  reviews: Review[];

  @OneToMany(() => Payment, (p) => p.user)
  payments: Payment[];
}