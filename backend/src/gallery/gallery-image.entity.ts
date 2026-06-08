import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('gallery_images')
export class GalleryImage {
  @PrimaryGeneratedColumn()
  id!: number;

  // Public path, e.g. /images/gallery/abc.jpg or /images/ella.webp
  @Column({ length: 500 })
  src!: string;

  @Column({ length: 255, nullable: true })
  title!: string;

  @Column({ length: 100, nullable: true })
  category!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
