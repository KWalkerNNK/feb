import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto } from './dto/dto.create-group';
import { Injectable, Res } from '@nestjs/common';
import { Conversation } from 'src/database/entity/entity.conversation';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}
  async createGroup(
    dto: CreateGroupDto,
    creatorId: any,
    @Res() res,
  ): Promise<Object> {
    dto.creatorId = creatorId;
    await this.conversationRepository.save(dto);
    return res.redirect('/chat/1');
  }
}
