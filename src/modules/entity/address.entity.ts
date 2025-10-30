import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '@/modules/entity/user.entity';
import { Shipping } from '@/modules/entity/shipping.entity';

@Entity({ name: 'addresses' })
@Index(['userId', 'isDefault'])
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  userId: string;

  @ManyToOne(() => User, (u) => u.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text', nullable: true }) name?: string;
  @Column({ type: 'text', nullable: true }) phone?: string;
  @Column({ type: 'text', nullable: true }) label?: string;
  @Column({ type: 'text', nullable: true }) province?: string;
  @Column({ type: 'text', nullable: true }) district?: string;
  @Column({ type: 'text', nullable: true }) ward?: string;
  @Column({ type: 'text', nullable: true }) street?: string;
  @Column({ type: 'text', nullable: true }) postalCode?: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Shipping, (shipping) => shipping.address)
  shipping: Shipping;
}
