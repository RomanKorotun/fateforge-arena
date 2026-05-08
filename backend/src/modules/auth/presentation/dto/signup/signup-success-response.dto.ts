import { ApiProperty } from '@nestjs/swagger';

export class SignupSuccessResponseDto {
  @ApiProperty({
    description: 'Повідомлення про успішну реєстрацію',
    example:
      'Ваш акаунт створено. Для завершення реєстрації підтвердіть електронну пошту.',
  })
  message!: string;
}
