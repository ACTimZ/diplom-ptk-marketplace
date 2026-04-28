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

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (e) {
      return null;
    }
  }

  // До (если при данном коде попробовать привязать яндексid, который уже привязан к другому аккаунту - выпадет ошибка 500):
  async validateYandexUser(yandexData: any, currentUser?: any) {
    if (currentUser && currentUser.sub) {
      const userId = currentUser.sub;

      return this.usersService.update(userId, {
        yandexId: yandexData.yandexId,
        avatarUrl: yandexData.avatarUrl,
        email: yandexData.email,
      });
    }

    let user = await this.usersService.findByYandexId(yandexData.yandexId);

    if (!user) {
      user = await this.usersService.findByEmail(yandexData.email);
      if (user) {
        user = await this.usersService.update(user.id, {
          yandexId: yandexData.yandexId,
          avatarUrl: yandexData.avatarUrl,
        });
      }
    }

    if (!user) {
      user = await this.usersService.create({
        email: yandexData.email,
        name: yandexData.name,
        yandexId: yandexData.yandexId,
        avatarUrl: yandexData.avatarUrl,
        login: `user_${yandexData.yandexId}`,
        role: { connect: { id: 1 } },
        status: { connect: { id: 1 } },
      });
    }

    return user;
  }

  // После (если пользователь попробует привязать яндексid и он окажется уже привязан к какому-то аккаунту, то пользователь переавторизуется под тем аккаунтом, к которому привязан яндексid):
  // verifyToken(token: string) {
  //   try {
  //     return this.jwtService.verify(token, {
  //       secret: process.env.JWT_SECRET, // Убедись, что секрет совпадает с тем, что в модуле
  //     });
  //   } catch (e) {
  //     return null;
  //   }
  // }

  // async validateYandexUser(yandexData: any, currentUser: any) {
  //   const { id: yandexId, email, name, avatarUrl } = yandexData;

  //   let user = await this.usersService.findByYandexId(String(yandexId));

  //   if (user) {
  //     return user;
  //   }

  //   user = await this.usersService.findByEmail(email);

  //   if (user) {
  //     return this.usersService.update(user.id, {
  //       yandexId: String(yandexId),
  //       avatarUrl: user.avatarUrl || avatarUrl,
  //     });
  //   }

  //   if (currentUser && currentUser.id) {
  //     return this.usersService.update(currentUser.id, {
  //       yandexId: String(yandexId),
  //     });
  //   }

  //   return this.usersService.create({
  //     email,
  //     yandexId: String(yandexId),
  //     name,
  //     avatarUrl,
  //     login: `id${yandexId}`,
  //     passwordHash: '',
  //     role: {
  //       connect: { id: 1 },
  //     },
  //     status: {
  //       connect: { id: 1 },
  //     },
  //   });
  // }
}
