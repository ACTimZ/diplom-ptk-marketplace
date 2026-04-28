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
    //
  }

  @Get('yandex-auth')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthCallback(@Req() req, @Res() res: Response) {
    const cookies = req.headers.cookie?.split('; ').reduce((acc, v) => {
      const [name, value] = v.split('=');
      acc[name] = value;
      return acc;
    }, {});

    const token = cookies?.['auth_token'];
    let currentUser = null;

    if (token) {
      try {
        currentUser = this.authService.verifyToken(token);
      } catch (e) {
        currentUser = null;
      }
    }

    const user = await this.authService.validateYandexUser(
      req.user,
      currentUser,
    );

    const { access_token } = await this.authService.generateToken(
      user.id,
      user.email,
    );

    return res.redirect(`http://localhost:3001/login?token=${access_token}`);
  }
}
