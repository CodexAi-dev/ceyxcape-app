import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn()
  id!: number;

  // 'general' = contact form, 'tour' = inquiry from a specific tour page
  @Column({ type: 'enum', enum: ['general', 'tour'], default: 'general' })
  type!: string;

  @Column({ length: 150 })
  name!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ length: 30, nullable: true })
  phone!: string;

  @Column({ length: 255, nullable: true })
  subject!: string;

  @Column({ type: 'text' })
  message!: string;

  // Tour context — only set for type = 'tour'
  @Column({ name: 'tour_id', type: 'int', nullable: true })
  tourId!: number;

  @Column({ name: 'tour_name', length: 255, nullable: true })
  tourName!: string;

  @Column({ name: 'tour_date', length: 30, nullable: true })
  tourDate!: string;

  @Column({ type: 'int', nullable: true })
  participants!: number;

  @Column({
    type: 'enum',
    enum: ['new', 'read', 'responded', 'archived'],
    default: 'new',
  })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
