import { Controller, Get, Res } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('')
  home(@Res() res): Object {
    return this.homeService.home(res);
  }
}
