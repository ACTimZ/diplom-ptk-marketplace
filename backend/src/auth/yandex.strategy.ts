import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-yandex';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

// src/auth/yandex.strategy.ts

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('YANDEX_CLIENT_ID'),
      clientSecret: configService.get<string>('YANDEX_CLIENT_SECRET'),
      callbackURL: configService.get<string>('YANDEX_CALLBACK_URL'),
      passReqToCallback: true, // ВАЖНО: позволяет получить req в validate
    });
  }

  async validate(
    req: any, // Теперь 'req' ОБЯЗАТЕЛЬНО первый, если passReqToCallback: true
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    // Проверяем, пришел ли профиль, чтобы избежать TypeError
    if (!profile || !profile._json) {
      return done(
        new Error('Не удалось получить данные профиля от Яндекс'),
        null,
      );
    }

    const { id, emails, photos, _json } = profile;

    // Безопасное извлечение имени
    const fullName =
      _json.real_name ||
      (_json.first_name || _json.last_name
        ? `${_json.first_name || ''} ${_json.last_name || ''}`.trim()
        : profile.displayName) ||
      `user_${id}`;

    const yandexUser = {
      yandexId: id,
      email: emails && emails[0] ? emails[0].value : _json.default_email,
      name: fullName,
      // Выбираем аватарку получше (islands-retina-medium — это 100x100 или больше)
      avatarUrl: photos && photos[0] ? photos[0].value : null,
    };

    // Передаем собранный объект дальше в контроллер
    done(null, yandexUser);
  }
}
