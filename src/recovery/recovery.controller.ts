import { RecoveryService } from './recovery.service';
import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Res,
  Render,
  Body,
} from '@nestjs/common';
import { CronJob } from 'cron';

@Controller('forgot')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Get('')
  @Render('recovery/forgot')
  forgot(): void {}

  @Get('recovery')
  @Render('recovery/recovery')
  recovery(): void {}

  @Post('')
  async getRecovery(@Body('email') email: string, @Res() res): Promise<Object> {
    await this.startAutoDeleteRecord(email);
    return await this.recoveryService.getRecovery(email, res);
  }

  @Post('verify/:email')
  async verify(
    @Param('email') email: string,
    @Body('code', ParseIntPipe) code: number,
    @Res() res,
  ): Promise<Object> {
    return await this.recoveryService.verify(email, code, res);
  }

  startAutoDeleteRecord(email: string): void {
    const job = new CronJob('*/3 * * * *', async () => {
      const result = await this.recoveryService.autoDeleteRecord(email);
      if (result) {
        console.dir('There is no record to delete');
        job.stop();
      }
    });
    job.start();
    console.dir('Running');
  }
}
