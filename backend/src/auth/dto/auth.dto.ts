import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsEmail({}, { message: 'Введите корректный адрес электронной почты' })
  @MaxLength(100, { message: 'Email слишком длинный' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Логин не может быть пустым' })
  @MinLength(3, { message: 'Логин должен быть не менее 3 символов' })
  @MaxLength(20, { message: 'Логин не должен превышать 20 символов' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Логин может содержать только латинские буквы, цифры и подчёркивание',
  })
  login: string;

  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
  @MaxLength(32, { message: 'Пароль не должен превышать 32 символа' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, {
    message:
      'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один спецсимвол',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Имя слишком длинное' })
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, {
    message: 'Имя должно содержать только буквы, пробелы и дефис',
  })
  @Transform(({ value }) => value?.trim())
  name?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Введите корректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  @MaxLength(100)
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MaxLength(32)
  password: string;
}
