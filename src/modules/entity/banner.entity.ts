import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { config } from '@/config';
import { BannerPosition } from '@/modules/ecommerce/enums/banner.enum';

@Entity()
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  imagePath?: string;

  @Expose()
  get imageUrl(): string | undefined {
    if (!this.imagePath) {
      return undefined;
    }
    return config.MINIO.expose(this.imagePath);
  }

  @Column({ type: 'text', nullable: true })
  link?: string;

  @Column({ enum: BannerPosition })
  position: BannerPosition;

  // ưu tiên sắp xếp
  @Column({ type: 'int' })
  sortOrder: number;

  // thời gian hiệu lực (optional)
  @Column()
  startDate?: Date;

  @Column()
  endDate?: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
