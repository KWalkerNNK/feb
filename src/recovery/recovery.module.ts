import { Recovery } from '../database/entity/entity.recovery';
import { RecoveryController } from './recovery.controller';
import { Module } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { User } from '../database/entity/entity.user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  SECRET_HOST,
  SECRET_PASS,
  SECRET_USER_KEY,
} from 'src/constant/constant.secret';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: SECRET_HOST,
        port: 465,
        secure: true,
        auth: {
          user: SECRET_USER_KEY,
          pass: SECRET_PASS,
        },
      },
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User, Recovery]),
  ],
  controllers: [RecoveryController],
  providers: [RecoveryService],
})
export class RecoveryModule {}
