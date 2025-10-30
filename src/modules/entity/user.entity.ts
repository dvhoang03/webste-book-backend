import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@/modules/user/user.enum';
import { Address } from '@/modules/entity/address.entity';
import { Cart } from '@/modules/entity/cart.entity';
import { Order } from '@/modules/entity/order.entity';
import { Review } from '@/modules/entity/review.entity';
import { Payment } from '@/modules/entity/payment.entity';
import { config } from '@/config';
import { Expose } from 'class-transformer';
import { ReturnRequest } from '@/modules/entity/return-request.entity';
import { RentalReturn } from '@/modules/entity/rental-return.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text', nullable: true })
  fullName?: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @Column({ type: 'text', default: Role.USER })
  role?: Role;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

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
    return `${config.MINIO.expose(this.photoPath)}`;
  }

  @Column({ type: 'text', nullable: true })
  thumbnailPath?: string;

  @Expose()
  get thumbnailUrl(): string | undefined {
    if (!this.thumbnailPath) {
      return undefined;
    }
    return `${config.MINIO.expose(this.thumbnailPath)}`;
  }

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // relations
  @OneToMany(() => Address, (a) => a.user)
  addresses?: Address[];

  @OneToOne(() => Cart, (c) => c.user)
  cart?: Cart;

  @OneToMany(() => Order, (o) => o.user)
  orders?: Order[];

  // @OneToMany(() => Rental, (r) => r.user)
  // rentals?: Rental[];

  @OneToMany(() => Review, (r) => r.user)
  reviews?: Review[];

  @OneToMany(() => Payment, (p) => p.user)
  payments?: Payment[];

  // --- CÁC TRƯỜNG MỚI ĐƯỢC THÊM (Quan hệ) ---

  // ✅ Các phiếu hoàn tiền (hàng MUA) của user
  @OneToMany(() => ReturnRequest, (rr) => rr.user)
  returnRequests: ReturnRequest[];

  // ✅ Các phiếu trả sách (hàng THUÊ) của user
  @OneToMany(() => RentalReturn, (rr) => rr.user)
  rentalReturns: RentalReturn[];
}
