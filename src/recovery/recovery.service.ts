import { User } from './../database/entity/entity.user';
import { Recovery } from './../database/entity/entity.recovery';
import { HttpException, Injectable, Logger, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { MESSAGE } from 'src/utils/util.message';

@Injectable()
export class RecoveryService {
  constructor(
    private readonly mailService: MailerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Recovery)
    private readonly recoveryRepository: Repository<Recovery>,
  ) {}

  private readonly logger = new Logger(RecoveryService.name);

  async getRecovery(email: string, @Res() res): Promise<Object> {
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      const userId: any = userExists.id;
      const code = await this.verificationCode();
      await this.recoveryRepository.save({ userId, code });

      await this.mailService.sendMail({
        to: email,
        from: '"K-Walker" kwalker.nnk@gmail.com',
        subject: `${userExists.fullName} ơi! Bạn hãy đặt lại mật khẩu của mình nhé!🤍`,
        html: `<!DOCTYPE html>
                <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <title>Khôi phục tài khoản</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #0077c2;
                        }

                        .card {
                            margin: 0 auto;
                            margin-top: 30px;
                            background-color: #fff;
                            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
                            border-radius: 10px;
                            max-width: 600px;
                        }

                        .card-header {
                            background-color: #0077c2;
                            color: #fff;
                            border-radius: 10px 10px 0 0;
                            font-weight: bold;
                            font-size: 1.5rem;
                            padding: 20px;
                        }

                        .card-body {
                            padding: 50px;
                        }

                        .card-text {
                            font-size: 1.1rem;
                            margin-bottom: 30px;
                            color: #4a4a4a;
                        }

                        .btn-primary {
                            background-color: #0077c2;
                            border: none;
                            font-weight: bold;
                            padding: 15px 50px;
                            border-radius: 30px;
                            color: #fff;
                            transition: all 0.3s ease;
                        }

                        .btn-primary:hover {
                            background-color: #006bbf;
                            cursor: pointer;
                        }

                        .card-footer {
                            font-size: 0.8rem;
                            color: #fff;
                            background-color: #0077c2;
                            border-radius: 0 0 10px 10px;
                            padding: 10px;
                        }
                    </style>
                </head>

                <body>
                    <div class="card text-center">
                        <div class="card-header">Chào ${userExists.fullName}</div>
                        <div class="card-body">
                            <h4 class="card-title">Khôi phục tài khoản</h4>
                            <p class="card-text">Đây là mã khôi phục tài khoản của bạn!</p>
                            <span class="btn btn-primary">${code}</span>
                        </div>
                        <div class="card-footer">Mã này có thời hạn là 3 phút. Vui lòng không chia sẻ mã này cho bất kì ai!</div>
                    </div>
                </body>

                </html>`,
      });

      res.cookie('id', userExists.id, {
        maxAge: 60 * 1000 * 60 * 24 * 14,
        httpOnly: false,
      });
      res.cookie('email', userExists.email, {
        maxAge: 60 * 1000 * 60 * 24 * 14,
        httpOnly: false,
      });
      res.cookie('fullName', userExists.fullName, {
        maxAge: 60 * 1000 * 60 * 24 * 14,
        httpOnly: false,
      });

      return await res.redirect('/forgot/recovery');
    }
    return MESSAGE.EMAIL_NOT_FOUND;
  }

  async verify(email: string, code: number, @Res() res): Promise<Object> {
    const codeExists = await this.recoveryRepository.findOne({
      relations: {
        userId: true,
      },
      where: {
        code,
      },
    });
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (codeExists && codeExists.userId.id === userExists.id) {
      return await res.redirect(
        `/profile/edit/${userExists.id}?email=${email}`,
      );
    }
    throw new HttpException(MESSAGE.WRONG_VERIFICATION_CODE, 407);
  }

  async verificationCode() {
    const code = await Math.floor(Math.random() * 1e6);
    return code;
  }

  async autoDeleteRecord(email: string): Promise<boolean> {
    try {
      const deleteResult = await this.recoveryRepository
        .createQueryBuilder()
        .delete()
        .where(`userId IN (SELECT id FROM User WHERE email = :email)`, {
          email,
        })
        .execute();
      console.log(`Deleted ${deleteResult.affected} records.`);
      return true;
    } catch (err) {
      this.logger.error('Error auto deleting record', err);
      return false;
    }
  }
}
