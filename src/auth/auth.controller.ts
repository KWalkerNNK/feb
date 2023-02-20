import { UserLoginDto } from './dto/dto.user-login';
import { UserRegisterDto } from './dto/dto.index';
import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  @Render('register')
  registerGet(): void {
    return this.authService.registerGet();
  }

  @Get('login')
  @Render('login')
  loginGet(): void {
    return this.authService.loginGet();
  }

  @Post('register')
  async register(
    @Body() user: UserRegisterDto,
    @Res({ passthrough: true }) res,
  ): Promise<Object> {
    return this.authService.register(user, res);
  }

  @Post('login')
  async login(@Body() user: UserLoginDto, @Res() res): Promise<Object> {
    return this.authService.login(user, res);
  }
}
