import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailSuccessResponseDto {
  @ApiProperty({
    description: 'Повідомлення про успішну реєстрацію',
    example: 'Email успішно підтверджено'
  })
  message!: string;
}
