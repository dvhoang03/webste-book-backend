import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookCategory } from '@/modules/entity/book-category.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  parentIds: string;

  @ManyToOne(() => Category, (c) => c.children, { onDelete: 'SET NULL' })
  parent?: Category;

  @OneToMany(() => Category, (c) => c.parent)
  children: Category[];

  @OneToMany(() => BookCategory, (bc) => bc.category)
  bookCategories: BookCategory[];
}
