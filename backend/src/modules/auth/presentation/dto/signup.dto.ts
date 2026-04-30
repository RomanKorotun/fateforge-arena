import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

import { PASSWORD_REGEX } from '../../../../common/constants/regex.constants';

export class SignupDto {
  @IsNotEmpty({ message: 'Поле username не може бути пустим' })
  @IsString({ message: 'Поле username повинно бути рядком' })
  username!: string;

  @IsNotEmpty({ message: 'Поле email не може бути пустим' })
  @IsEmail({}, { message: 'Поле email містить не вірний формат' })
  email!: string;

  @IsNotEmpty({ message: 'Поле password не може бути пустим' })
  @Matches(PASSWORD_REGEX, {
    message:
      'Поле password повинно містити мінімум 6 символів, принаймні одну цифру та одну велику літеру',
  })
  password!: string;
}
