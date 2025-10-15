import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity({ name: 'reviews' })
@Index(['bookId', 'userId'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (u) => u.reviews, { onDelete: 'CASCADE' })
  user: User;

  @Column('uuid')
  bookId: string;

  @ManyToOne(() => Book, (b) => b.reviews, { onDelete: 'CASCADE' })
  book: Book;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'int' })
  rating: number; // 1..5

  @Column({ type: 'text', nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  body?: string;
}
