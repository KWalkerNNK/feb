import { Conversation } from '../../database/entity/entity.conversation';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { User } from '../../database/entity/entity.user';
import { DeepPartial } from 'typeorm';

export class MessageDto {
  conversation: DeepPartial<Conversation>;

  senderId: DeepPartial<User>;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  attachment?: string;
}
