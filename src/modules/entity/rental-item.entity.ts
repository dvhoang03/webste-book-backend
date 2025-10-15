import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Rental } from './rental.entity';
import { Book } from './book.entity';

@Entity({ name: 'rental_items' })
@Index(['rentalId'])
export class RentalItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  rentalId: string;

  @ManyToOne(() => Rental, (r) => r.items, { onDelete: 'CASCADE' })
  rental: Rental;

  @Column('uuid')
  bookId: string;

  @ManyToOne(() => Book, (b) => b.rentalItems, { onDelete: 'RESTRICT' })
  book: Book;

  // nếu theo ERD có "bookCopyId"
  @Column({ type: 'uuid', nullable: true })
  bookCopyId?: string;

  @Column({ type: 'text', nullable: true })
  state?: string; // tình trạng sách khi thuê/trả

  @Column({ type: 'int', nullable: true })
  rentDays?: number;

  @Column({ type: 'date', nullable: true })
  rentStart?: string;

  @Column({ type: 'date', nullable: true })
  rentDue?: string;
}
