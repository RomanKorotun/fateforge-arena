import { ApiProperty } from '@nestjs/swagger';

export class SignoutSuccessResponseDto {
  @ApiProperty({
    description: 'Повідомлення про успішний вихід користувача із системи',
    example: 'Signout success',
  })
  message!: string;
}
