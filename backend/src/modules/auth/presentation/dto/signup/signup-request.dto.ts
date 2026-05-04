import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PASSWORD_REGEX } from '../../../../../common/constants/regex.constants';

export class SignupRequestDto {
  @ApiProperty({ description: "Ім'я користувача", example: 'Test' })
  @IsNotEmpty({ message: 'Поле username не може бути пустим' })
  @IsString({ message: 'Поле username повинно бути рядком' })
  username!: string;

  @ApiProperty({ description: 'Email користувача', example: 'test@gmail.com' })
  @IsNotEmpty({ message: 'Поле email не може бути пустим' })
  @IsEmail({}, { message: 'Поле email містить не вірний формат' })
  email!: string;

  @ApiProperty({ description: 'Пароль користувача', example: 'R1234567' })
  @IsNotEmpty({ message: 'Поле password не може бути пустим' })
  @Matches(PASSWORD_REGEX, {
    message:
      'Поле password повинно містити мінімум 6 символів, принаймні одну цифру та одну велику літеру',
  })
  password!: string;
}
