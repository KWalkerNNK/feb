import { User } from './../../database/entity/entity.user';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SECRET_KEY } from '../../constant/constant.secret';
import { Repository } from 'typeorm';
import { MESSAGE } from '../.././utils/util.message';

Injectable();
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET_KEY,
    });
  }

  //Dùng để hiển thị thông tin tài khoản hiện tại
  async validate(payload: { id: number; email: string; role?: string }) {
    const account = await this.repo.findOne({
      where: { email: payload.email },
    });

    if (!account) throw new HttpException(MESSAGE.NO_PROFILE_EXISTS, 404);

    delete account.password && delete account.role;
    return account;
  }
}
