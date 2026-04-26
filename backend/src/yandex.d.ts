declare module 'passport-yandex' {
  import { Strategy as PassportStrategy } from 'passport';

  export interface Profile {
    id: string;
    displayName: string;
    emails: [{ value: string }];
    photos?: [{ value: string }];
    _json: {
      id: string;
      display_name: string;
      default_email: string;
      real_name?: string;
      first_name?: string;
      last_name?: string;
      birthday?: string;
      sex?: 'male' | 'female';
      default_phone?: { id: number; number: string };
      is_avatar_empty?: boolean;
    };
  }

  export class Strategy extends PassportStrategy {
    constructor(options: any, verify: Function);
  }
}