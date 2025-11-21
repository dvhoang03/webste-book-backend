import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  category: string;

  @Column('text')
  content: string;

  // Thêm cột này (chỉ dùng cho Postgres, TypeORM cần cấu hình đặc biệt một chút hoặc query raw)
  @Column({ type: 'vector', nullable: true, length: 768 })
  embedding: number[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
