// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   OneToMany,
//   CreateDateColumn,
//   UpdateDateColumn,
//   Index,
// } from 'typeorm';
// import { User } from './user.entity';
// import { Address } from './address.entity';
// import { RentalItem } from './rental-item.entity';
// import {
//   RentalStatus,
//   RentalType,
// } from '@/modules/ecommerce/enums/product.enum';
//
// @Entity({ name: 'rentals' })
// @Index(['userId', 'status'])
// export class Rental {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;
//
//   @Column({ type: 'text', default: RentalType.DAILY })
//   type: RentalType;
//
//   @Column({ type: 'text', default: RentalStatus.DRAFT })
//   status: RentalStatus;
//
//   @Column('uuid')
//   userId: string;
//
//   @ManyToOne(() => User, (u) => u.rentals, { onDelete: 'RESTRICT' })
//   user: User;
//
//   @Column('uuid', { nullable: true })
//   addressId?: string;
//
//   @ManyToOne(() => Address, { onDelete: 'SET NULL' })
//   address?: Address;
//
//   @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
//   totalRentAmount: string;
//
//   @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
//   depositAmount: string;
//
//   @OneToMany(() => RentalItem, (ri) => ri.rental, { cascade: true })
//   items: RentalItem[];
//
//   @CreateDateColumn({ type: 'timestamptz' })
//   createdAt: Date;
//
//   @UpdateDateColumn({ type: 'timestamptz' })
//   updatedAt: Date;
//
//   @Column({ type: 'date', nullable: true })
//   dueDate?: string;
// }
