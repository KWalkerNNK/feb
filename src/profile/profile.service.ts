import { UserUpdateDto } from './dto/dto.update-user';
import { User } from '../database/entity/entity.user';
import { HttpException, Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MESSAGE } from 'src/utils/util.message';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constant/constant.secret';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(id: number, @Req() req): Promise<Object> {
    let currentUser = await req.cookies.id;
    const user = await this.userRepository.findOneBy({ id });
    user.DeletedAt = currentUser;
    return { user };
  }

  async editProfile(id: number, email: string): Promise<Object> {
    const user = await this.userRepository.findOneBy({ id, email });
    return { user };
  }

  async updateProfile(
    id: number,
    email: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<Object> {
    let userExists = await this.userRepository.findOneBy({ id, email });
    if (userExists) {
      const password = userUpdateDto.password;
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      userUpdateDto.password = hash;
      await this.userRepository.update(id, userUpdateDto);
      let user = await this.userRepository.findOneBy({ id });
      return { user };
    } else {
      throw new HttpException(MESSAGE.EDITING_ERROR, 500);
    }
  }
}
