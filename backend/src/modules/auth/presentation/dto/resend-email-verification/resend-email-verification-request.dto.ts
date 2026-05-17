import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendEmailVerificationRequestDto {
  @ApiProperty({ description: 'Email користувача', example: 'test@gmail.com' })
  @IsNotEmpty({ message: 'Поле email не може бути пустим' })
  @IsEmail({}, { message: 'Поле email містить не вірний формат' })
  email!: string;
}
