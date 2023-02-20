import { User } from './entity.user';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('conversation')
export class Conversation {
  @Column({ name: 'id', type: 'bigint' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', type: 'nvarchar', nullable: false })
  title: string;

  @ManyToOne(() => User, (creator) => creator.id)
  @JoinColumn({ name: 'creator_id' })
  creatorId: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  CreatedAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  UpdatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  DeletedAt?: Date;
}
