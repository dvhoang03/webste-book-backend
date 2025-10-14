import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@/modules/schema/user.schema';

@Entity({ name: 'addresses' })
@Index(['userId', 'isDefault'])
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  userId: string;

  @ManyToOne(() => User, (u) => u.addresses, { onDelete: 'CASCADE' })
  user: User;

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
}
