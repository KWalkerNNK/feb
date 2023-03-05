import {
  Controller,
  Get,
  Res,
  UseGuards,
  Query,
  ParseIntPipe,
  Render,
} from '@nestjs/common';
import { Param, Req } from '@nestjs/common/decorators';
import { Roles } from '../auth/decorators/decorator.index';
import { JwtGuard } from '../auth/guard/guard.jwt';
import { Role } from '../role/role';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  //http://localhost:3000/chat/messages/find?conversation-id=1&limit=5
  //Lấy tin nhắn theo cuộc hội thoại nhưng giới hạn hiển thị tin nhắn. Ví dụ limit = 5 thì lấy 5 tin nhắn gần nhất
  @Get('messages/find')
  async findByLimitMessagesInConversation(
    @Query('conversation-id', ParseIntPipe) conversationId: number,
    @Query('limit', ParseIntPipe) index: number,
  ): Promise<Object> {
    return await this.chatService.findByLimitMessagesInConversation(
      conversationId,
      index,
    );
  }

  // http://localhost:3000/chat/messages?conversation-id=1
  // Hiển thị tất cả tin nhắn theo cuộc hội thoại
  @Get('messages')
  async findMessagesByConversation(
    @Query('conversation-id', ParseIntPipe) conversationId: number,
  ): Promise<Object> {
    return await this.chatService.findMessagesByConversation(conversationId);
  }

  // @UseGuards(JwtGuard)
  // @Roles(Role.User)
  @Get(':slug')
  @Render('chat/index')
  async getConversations(
    @Param('slug', ParseIntPipe) slug: number,
    @Req() req,
  ): Promise<Object> {
    return await this.chatService.getConversations(slug, req);
  }
}
