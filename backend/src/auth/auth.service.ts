import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const existingLogin = await this.usersService.findByLogin(dto.login);
    if (existingLogin) {
      throw new BadRequestException('Этот логин уже занят');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      email: dto.email,
      login: dto.login,
      name: dto.name,
      passwordHash,
      role: { connect: { id: 1 } },
      status: { connect: { id: 1 } },
    });

    return this.generateToken(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return this.generateToken(user.id, user.email);
  }

  public generateToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // src/auth/auth.service.ts

  async validateYandexUser(details: any) {
    // 1. Ищем, есть ли такой человек
    let user = await this.usersService.findByYandexOrEmail(
      details.yandexId,
      details.email,
    );

    if (user) {
      // 2. Если пользователь есть, но зашел через Яндекс впервые — привязываем ID
      if (!user.yandexId) {
        user = await this.usersService.updateYandexId(
          user.id,
          details.yandexId,
          details.avatarUrl,
        );
      }
      return user;
    }

    // 3. Если пользователя нет — создаем (авторегистрация)
    // Для пароля при OAuth-регистрации оставляем null (в схеме passwordHash String? — это позволяет)
    return this.usersService.create({
      email: details.email,
      login: `user_${details.yandexId}`, // Генерируем уникальный логин
      name: details.name,
      yandexId: details.yandexId,
      avatarUrl: details.avatarUrl,
      role: { connect: { id: 1 } },
      status: { connect: { id: 1 } },
    });
  }
}
