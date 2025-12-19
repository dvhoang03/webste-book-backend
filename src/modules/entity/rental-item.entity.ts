import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
// import { Rental } from './rental.entity';
import { Book } from './book.entity';
import { Order } from '@/modules/entity/order.entity';
import { RentalType } from '@/modules/ecommerce/enums/product.enum';
import { RentalReturn } from '@/modules/entity/rental-return.entity';

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

  @Column({ type: 'int', nullable: true })
  returnQuantity?: number;

  @Column({ nullable: true })
  penalty?: number;

  // --- XÓA CÁC TRƯỜNG BỊ TRÙNG LẶP ---
  /*
  @Column({ type: 'text', nullable: true })
  rentalType: RentalType; // <-- XÓA

  @Column({ type: 'date', nullable: true })
  rentStart?: Date; // <-- XÓA

  @Column({ type: 'date', nullable: true })
  rentDue?: Date; // <-- XÓA
  */
  // --- (Kết thúc phần xóa) ---

  // Liên kết tới phiếu trả hàng
  @Column('uuid', { nullable: true })
  rentalReturnId?: string;

  @Column({ type: 'date', nullable: true })
  actualReturnDate?: Date; // Ngày thực tế trả (có thể set khi status là COMPLETED)
}
