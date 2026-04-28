import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() data: Prisma.UserCreateInput) {
    return this.usersService.create(data);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req) {
    // req.user попадает сюда из JwtStrategy (validate)
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateProfile(
    @Req() req,
    @Body() data: { description?: string; login?: string; password?: string },
  ) {
    // Если передается пароль, его нужно захешировать (импортируй bcrypt)
    const updateData: any = { ...data };
    if (data.password) {
      const bcrypt = require('bcrypt');
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
      delete updateData.password;
    }
    return this.usersService.update(req.user.userId, updateData);
  }
}
