import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  Index,
} from 'typeorm';
import { Book } from './book.entity';
import { Author } from './author.entity';

@Entity({ name: 'book_authors' })
@Unique(['bookId', 'authorId'])
export class BookAuthor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  bookId: string;

  @Column('uuid')
  @Index()
  authorId: string;

  @ManyToOne(() => Book, (b) => b.bookAuthors, { onDelete: 'CASCADE' })
  book: Book;

  @ManyToOne(() => Author, (a) => a.bookAuthors, { onDelete: 'CASCADE' })
  author: Author;
}
