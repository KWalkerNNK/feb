import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entity/entity.user';
import { Message } from '../database/entity/entity.message';
import { Conversation } from '../database/entity/entity.conversation';

@Module({
  imports: [TypeOrmModule.forFeature([User, Conversation, Message])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
