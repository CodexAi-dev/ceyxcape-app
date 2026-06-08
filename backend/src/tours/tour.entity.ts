import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

// Serialize array/object fields to JSON text in the DB and parse them back to
// real arrays on read — so gallery/itinerary/includes/excludes are always
// arrays in code (matching the frontend), never raw strings.
const jsonColumn = {
  to: (value: unknown): string | null =>
    value == null ? null : JSON.stringify(value),
  from: (value: string | null): unknown => {
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  },
};

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'tour_code', length: 50, unique: true, nullable: true })
  tourCode!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ length: 100, nullable: true })
  category!: string;

  @Column({ name: 'start_location', length: 255, nullable: true })
  startLocation!: string;

  @Column({ length: 255, nullable: true })
  location!: string;

  @Column({ type: 'int', nullable: true })
  duration!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price!: number;

  @Column({ name: 'discount_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice!: number;

  @Column({ length: 255, nullable: true })
  image!: string;

  @Column({ type: 'text', nullable: true, transformer: jsonColumn })
  gallery!: string[];

  @Column({ type: 'text', nullable: true, transformer: jsonColumn })
  itinerary!: any[];

  @Column({ type: 'text', nullable: true, transformer: jsonColumn })
  includes!: string[];

  @Column({ type: 'text', nullable: true, transformer: jsonColumn })
  excludes!: string[];

  @Column({ length: 50, default: 'active' })
  status!: string;

  @Column({ type: 'boolean', default: false })
  featured!: boolean;

  @Column({ type: 'int', default: 0 })
  views!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date;
}
