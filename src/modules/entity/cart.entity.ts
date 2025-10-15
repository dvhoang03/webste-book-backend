import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
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

  @ManyToOne(() => User, (u) => u.carts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CartItem, (ci) => ci.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
