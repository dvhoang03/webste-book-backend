import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Book } from './book.entity';
import { RentalType, TransactionType } from '@/modules/enums/product.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

@Entity({ name: 'cart_items' })
@Index(['cartId', 'bookId'], { unique: true })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  cartId: string;

  @ManyToOne(() => Cart, (c) => c.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @Column('uuid')
  bookId: string;

  @ManyToOne(() => Book, (b) => b.cartItems, { onDelete: 'CASCADE' })
  book: Book;

  @Column({ enum: TransactionType })
  type: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  // nếu là sản phẩm thuê: số ngày thuê
  @Column({ type: 'int', nullable: true })
  rentalType?: RentalType;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
