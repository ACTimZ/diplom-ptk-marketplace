import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth() {
    // Здесь ничего не пишем, Nest сам перенаправит пользователя на Яндекс
  }

  @Get('yandex-auth')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthCallback(@Req() req, @Res() res: Response) {
    // req.user здесь — это тот пользователь, которого вернул validateYandexUser
    const { access_token } = await this.authService.generateToken(
      req.user.id,
      req.user.email,
    );

    // Редиректим на фронтенд (Nuxt) и передаем токен параметром
    return res.redirect(`http://localhost:3001/login?token=${access_token}`);
  }
}