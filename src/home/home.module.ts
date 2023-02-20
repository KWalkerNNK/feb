import { HomeController } from './home.controller';
import { Module } from '@nestjs/common';
import { HomeService } from './home.service';

@Module({
  imports: [],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
