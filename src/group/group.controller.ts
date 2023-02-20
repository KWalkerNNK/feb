import { CreateGroupDto } from './dto/dto.create-group';
import { GroupService } from './group.service';
import { Controller, ParseIntPipe, Post } from '@nestjs/common';
import {
  Body,
  Param,
  Res,
} from '@nestjs/common/decorators/http/route-params.decorator';

@Controller('group/create')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post(':id')
  async createGroup(
    @Body() dto: CreateGroupDto,
    @Param('id', ParseIntPipe) creatorId: number,
    @Res() res,
  ): Promise<Object> {
    return this.groupService.createGroup(dto, creatorId, res);
  }
}
