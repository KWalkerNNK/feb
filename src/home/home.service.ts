import { Injectable, Res } from '@nestjs/common';

@Injectable()
export class HomeService {
  constructor() {}

  home(@Res() res): Object {
    return res.render('home/home');
  }
}
