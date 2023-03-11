import { MessageDto } from './dto/dto.chat';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/database/entity/entity.message';
import { Repository } from 'typeorm';
import { Server } from 'socket.io';

@WebSocketGateway(80, { namespace: 'websocket' })
// @WebSocketGateway({ namespace: 'websocket', server: 'https://01bc-117-2-155-129.ap.ngrok.io' })
export class ChatGateway {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  @WebSocketServer() server: Server;
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: MessageDto): Promise<void> {
    if (data.message == '') throw new Error(`Không nên để trống tin nhắn`);
    await this.server.emit('message', data);
    await this.messageRepository.save(data);
  }
}
