import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { User } from '@/modules/entity/user.entity';
import { CartItem } from '@/modules/entity/cart-item.entity';

@Entity({ name: 'carts' })
@Index(['userId'])
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @OneToOne(() => User, (u) => u.cart, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CartItem, (ci) => ci.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
