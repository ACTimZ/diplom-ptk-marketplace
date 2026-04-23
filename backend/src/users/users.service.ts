import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create() {
    return this.prisma.user.create({
      data: {
        login: 'test',
        email: 'test@mail.com',
        roleId: 1,
        statusId: 1,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }
}