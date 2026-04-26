import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { login },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        email: true,
        name: true,
        roleId: true,
        statusId: true,
        createdAt: true,
      },
    });
  }

  async findByYandexOrEmail(yandexId: string, email: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ yandexId }, { email }],
      },
    });
  }

  async updateYandexId(id: number, yandexId: string, avatarUrl?: string) {
    return this.prisma.user.update({
      where: { id },
      data: { yandexId, avatarUrl },
    });
  }
}
