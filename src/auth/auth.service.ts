import { HttpException, Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLoginDto, UserRegisterDto } from './dto/dto.index';
import { SALT_ROUNDS, SECRET_KEY } from '../constant/constant.secret';
import { MESSAGE } from '../utils/util.message';
import { User } from '../database/entity/entity.user';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  registerGet(): void {}

  loginGet(): void {}

  async register(
    user: UserRegisterDto,
    @Res({ passthrough: true }) res,
  ): Promise<Object> {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (userExists) throw new HttpException(MESSAGE.SIGNUP_FAILED, 401);

      const password = await user.password;
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      user.password = hash;

      await this.userRepository.save(user);

      // const value = await this.signToken(user.id, user.email, user.role);
      // res.cookie('accessToken', value, {
      //   maxAge: 60 * 1000 * 60 * 24 * 14,
      //   httpOnly: false,
      // });
      res.cookie('id', user.id, {
        maxAge: 60 * 1000 * 60 * 24 * 14,
        httpOnly: false,
      });
      return res.redirect('/chat/1');
    } catch (err) {
      throw err;
    }
  }

  async login(user: UserLoginDto, @Res() res): Promise<Object> {
    const userExists = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (userExists) {
      const isMatch = await bcrypt.compare(user.password, userExists.password);
      if (isMatch) {
        // const value = await this.signToken(
        //   userExists.id,
        //   userExists.email,
        //   userExists.role,
        // );
        // res.cookie('accessToken', value, {
        //   maxAge: 60 * 1000 * 60 * 24 * 14,
        //   httpOnly: false,
        // });
        res.cookie('id', userExists.id, {
          maxAge: 60 * 1000 * 60 * 24 * 14,
          httpOnly: false,
        });
        return res.redirect('/chat/1');
      }
      throw new HttpException(MESSAGE.WRONG_PASSWORD, 407);
    }
    throw new HttpException(MESSAGE.WRONG_EMAIL, 400);
  }

  async signToken(
    userId: number,
    email: string,
    role?: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      id: userId,
      email,
      role,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '14d',
      secret: SECRET_KEY,
    });
    return {
      access_token: token,
    };
  }
}
