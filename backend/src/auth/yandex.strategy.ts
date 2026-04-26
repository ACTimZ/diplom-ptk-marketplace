import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-yandex';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService, // Внедряем сервис конфига
  ) {
    super({
      clientID: configService.get<string>('YANDEX_CLIENT_ID'),
      clientSecret: configService.get<string>('YANDEX_CLIENT_SECRET'),
      callbackURL: configService.get<string>('YANDEX_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    // ... твоя логика validate остается прежней ...
    const { id, displayName, emails, photos, _json } = profile;
    
    const yandexUser = {
      yandexId: id,
      email: emails[0].value,
      name: displayName || _json.real_name || id,
      avatarUrl: photos?.[0]?.value || null,
      phone: _json.default_phone?.number || null,
      birthday: _json.birthday || null,
    };

    // Передаем эти данные в сервис для обработки (создания или поиска пользователя)
    const user = await this.authService.validateYandexUser(yandexUser);
    done(null, user);
  }
}
