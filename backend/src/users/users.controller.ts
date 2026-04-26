import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
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
}
