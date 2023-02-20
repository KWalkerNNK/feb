import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/database/entity/entity.user';
import { DeepPartial } from 'typeorm';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  creatorId: DeepPartial<User>;
}
