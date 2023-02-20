import { Conversation } from '../database/entity/entity.conversation';
import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
