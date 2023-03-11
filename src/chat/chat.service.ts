import { Message } from '../database/entity/entity.message';
import { Conversation } from '../database/entity/entity.conversation';
import { Injectable, Res, Req } from '@nestjs/common';
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

  async getConversations(id: number, @Req() req): Promise<Object> {
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
    const skip = countMessages - 20 > 0 ? countMessages - 20 : 0;
    if (conversationExists) {
      messages = await this.messageRepository.find({
        skip,
        take: 20,
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
    let currentId = await req.cookies.id;
    return { conversation, messages, currentId };
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

  async getConversationByTitle(title: string, @Req() req): Promise<Object> {
    const conversationUnique = await this.conversationRepository.findOneBy({
      title,
    });
    const countMessages = await this.messageRepository.count({
      where: {
        conversation: {
          title,
        },
      },
    });
    let messages: Object;
    const skip = countMessages - 20 > 0 ? countMessages - 20 : 0;
    if (conversationUnique) {
      messages = await this.messageRepository.find({
        skip,
        take: 20,
        relations: {
          conversation: true,
          senderId: true,
        },
        where: {
          conversation: {
            title,
          },
        },
      });
    }
    let currentId = await req.cookies.id;
    return { conversationUnique, messages, currentId };
  }
}
