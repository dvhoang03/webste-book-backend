import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  Index,
} from 'typeorm';
import { Book } from './book.entity';
import { Category } from './category.entity';

@Entity({ name: 'book_categories' })
@Unique(['bookId', 'categoryId'])
export class BookCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  bookId: string;

  @Column('uuid')
  @Index()
  categoryId: string;

  @ManyToOne(() => Book, (b) => b.bookCategories, { onDelete: 'CASCADE' })
  book: Book;

  @ManyToOne(() => Category, (c) => c.bookCategories, { onDelete: 'CASCADE' })
  category: Category;
}
