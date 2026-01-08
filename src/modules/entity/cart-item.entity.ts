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
import {
  RentalType,
  TransactionType,
} from '@/modules/ecommerce/enums/product.enum';
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
  type: TransactionType;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'numeric', nullable: true })
  price: number;

  @Column({ type: 'boolean', default: false })
  isSelected: boolean;

  // nếu là sản phẩm thuê: số ngày thuê
  @Column({ enum: RentalType, nullable: true })
  rentalType?: RentalType;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
