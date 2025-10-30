import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BookAuthor } from '@/modules/entity/book-author.entity';
import { BookCategory } from '@/modules/entity/book-category.entity';
import { OrderItem } from '@/modules/entity/order-item.entity';
import { CartItem } from '@/modules/entity/cart-item.entity';
import { RentalItem } from '@/modules/entity/rental-item.entity';
import { Review } from '@/modules/entity/review.entity';
import { Expose } from 'class-transformer';
import { config } from '@/config';
import { Publisher } from '@/modules/entity/publisher.entity';
import { BookStatus } from '@/modules/ecommerce/enums/product.enum';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  sku: string;

  @Column({ type: 'text', default: BookStatus.DRAFT })
  status: BookStatus;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // ❌ Xóa: publisher?: string;
  // ✅ Thay bằng:
  @ManyToOne(() => Publisher, (publisher) => publisher.books, {
    nullable: true,
    onDelete: 'SET NULL', // nếu publisher bị xóa thì để null trong book
  })
  @JoinColumn({ name: 'publisherId' })
  publisher?: Publisher;

  @Column({ type: 'uuid', nullable: true })
  publisherId?: string;

  @Column({ type: 'text', nullable: true })
  language?: string;

  @Column({ type: 'text', nullable: true })
  isbn?: string;

  @Column({ type: 'int', nullable: true })
  stockQty: number;

  @Column({ type: 'int', nullable: true })
  page?: number;

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ type: 'text', nullable: true })
  publishedAt?: string;

  @Column({ type: 'text', nullable: true })
  photoPath?: string;

  // Thuộc tính này không phải là một cột trong database
  // Nó là một "computed property" (thuộc tính được tính toán)
  @Expose()
  get photoUrl(): string | undefined {
    if (!this.photoPath) {
      return undefined;
    }
    // Logic để tạo URL đầy đủ
    // Ví dụ: http://localhost:9000/book/path/to/photo.jpg
    return config.MINIO.expose(this.photoPath);
  }

  @Column({ type: 'text', nullable: true })
  thumbnailPath?: string;

  @Expose()
  get thumbnailUrl(): string | undefined {
    if (!this.thumbnailPath) {
      return undefined;
    }
    return config.MINIO.expose(this.thumbnailPath);
  }

  // ✅ Mảng chứa nhiều đường dẫn media
  @Column({ type: 'simple-array', nullable: true })
  mediaPaths?: string[];

  // ✅ Computed property trả về URL đầy đủ cho từng file
  @Expose()
  get mediaUrls(): string[] | undefined {
    if (!this.mediaPaths || this.mediaPaths.length === 0) {
      return undefined;
    }
    return this.mediaPaths.map((path) => config.MINIO.expose(path));
  }

  // ----------------------------
  // Các cột giá (từ BookPricing)
  // ----------------------------
  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  sellerPrice: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  rentPricePerDay?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  rentPenaltyPerDay?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  rentPricePerWeek?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  rentPenaltyPerWeek?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  rentPricePerMonth?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  rentPenaltyPerMonth?: string;

  // ----------------------------
  // Quan hệ
  // ----------------------------

  @OneToMany(() => BookAuthor, (ba) => ba.book, { cascade: true })
  bookAuthors: BookAuthor[];

  @OneToMany(() => BookCategory, (bc) => bc.book, { cascade: true })
  bookCategories: BookCategory[];

  @OneToMany(() => OrderItem, (oi) => oi.book)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (ci) => ci.book)
  cartItems: CartItem[];

  @OneToMany(() => RentalItem, (ri) => ri.book)
  rentalItems: RentalItem[];

  @OneToMany(() => Review, (r) => r.book)
  reviews: Review[];
}
