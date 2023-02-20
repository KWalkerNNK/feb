import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @Column({ name: 'id', type: 'bigint' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({ name: 'phone_number', nullable: false })
  phoneNumber: string;

  @Column({ name: 'email', unique: true, nullable: false })
  email: string;

  @Column({ name: 'address', nullable: false })
  address: string;

  @Column({ name: 'password', nullable: false, type: 'text' })
  password: string;

  @Column({ name: 'role', nullable: false, default: 'user' })
  role: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  CreatedAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  UpdatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  DeletedAt?: Date;
}
