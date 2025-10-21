import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
// import { Rental } from './rental.entity';
import { Book } from './book.entity';
import { Order } from '@/modules/entity/order.entity';
import { RentalType } from '@/modules/ecommerce/enums/product.enum';

@Entity({ name: 'rental_items' })
@Index(['orderId'])
export class RentalItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  orderId: string;

  @ManyToOne(() => Order, (order) => order.rentalItems, { onDelete: 'CASCADE' })
  order: Order;

  @Column('uuid')
  bookId: string;

  @ManyToOne(() => Book, (b) => b.rentalItems, { onDelete: 'RESTRICT' })
  book: Book;

  @Column({ type: 'text', nullable: true })
  state?: string; // tình trạng sách khi thuê/trả

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  rentalType: RentalType;

  @Column({ type: 'date', nullable: true })
  rentStart?: string;

  @Column({ type: 'date', nullable: true })
  rentDue?: string;
}
