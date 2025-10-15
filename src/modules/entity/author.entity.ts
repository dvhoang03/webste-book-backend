import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookAuthor } from '@/modules/entity/book-author.entity';

@Entity({ name: 'authors' })
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updateAt: Date;

  @OneToMany(() => BookAuthor, (ba) => ba.author)
  bookAuthors: BookAuthor[];
}
