import { Conversation } from './entity.conversation';
import { User } from './entity.user';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('message')
export class Message {
  @Column({ name: 'id', type: 'bigint' })
  @PrimaryGeneratedColumn()
  id: number;

  //Mã cuộc hội thoại
  @ManyToOne(() => Conversation, (conversation) => conversation.id)
  @JoinColumn({ name: 'conversation' })
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'sender_id' })
  senderId: User;

  @Column({ name: 'message', type: 'text', nullable: false })
  message: string;

  //Tệp đính kèm
  @Column({ name: 'attachment', type: 'text', nullable: true })
  attachment: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  CreatedAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  UpdatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  DeletedAt?: Date;
}
