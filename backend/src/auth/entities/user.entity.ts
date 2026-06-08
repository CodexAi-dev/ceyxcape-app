import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 100, unique: true, nullable: true })
  username!: string;

  @Column({ length: 255, select: false })
  password!: string;

  @Column({ name: 'first_name', length: 100, nullable: true })
  firstName!: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName!: string;

  @Column({ length: 20, nullable: true })
  phone!: string;

  @Column({ name: 'profile_pic', length: 255, nullable: true })
  profilePic!: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role!: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'suspended'], default: 'active' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date;
}
