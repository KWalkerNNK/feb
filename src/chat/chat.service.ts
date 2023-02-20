import { Message } from '../database/entity/entity.message';
import { User } from '../database/entity/entity.user';
import { Conversation } from '../database/entity/entity.conversation';
import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getConversations(id: number): Promise<Object> {
    const conversation = await this.conversationRepository.find();
    const conversationExists = await this.conversationRepository.findOneBy({
      id,
    });
    const countMessages = await this.messageRepository.count({
      where: {
        conversation: {
          id,
        },
      },
    });
    let messages: Object;
    const skip = countMessages - 10 > 1 ? countMessages - 10 : 0;
    if (conversationExists) {
      messages = await this.messageRepository.find({
        skip,
        take: 10,
        relations: {
          conversation: true,
          senderId: true,
        },
        where: {
          conversation: {
            id,
          },
        },
      });
    }
    return { conversation, messages };
  }

  async findMessagesByConversation(id: number): Promise<Object> {
    const conversationExists = await this.conversationRepository.findOneBy({
      id,
    });
    if (conversationExists) {
      return await this.messageRepository.find({
        relations: {
          conversation: true,
          senderId: true,
        },
        where: {
          conversation: {
            id,
          },
        },
      });
    }
    return {
      message: `Không tìm thấy MÃ CUỘC HỘI THOẠI = ${id} nên không thể tìm những dòng tin nhắn. Vui lòng tạo một cuộc hội thoại mới`,
    };
  }

  async findByLimitMessagesInConversation(
    id: number,
    index: number,
  ): Promise<Object> {
    const conversationExists = await this.conversationRepository.findOneBy({
      id,
    });
    const countMessages = await this.messageRepository.count({
      where: {
        conversation: {
          id,
        },
      },
    });
    if (conversationExists) {
      const skip = countMessages - index > 1 ? countMessages - index : 0;
      return await this.messageRepository.find({
        skip,
        take: index,
        relations: {
          conversation: true,
        },
        where: {
          conversation: {
            id,
          },
        },
      });
    }
    return {
      message: `Không tìm thấy MÃ CUỘC HỘI THOẠI = ${id} nên không thể tìm những dòng tin nhắn. Vui lòng tạo một cuộc hội thoại mới`,
    };
  }
}