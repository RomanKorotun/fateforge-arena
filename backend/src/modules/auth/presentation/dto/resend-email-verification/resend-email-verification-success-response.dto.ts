import { ApiProperty } from '@nestjs/swagger';

export class ResendEmailVerificationSuccessResponseDto {
  @ApiProperty({
    description: 'Повідомлення про успішну повторну відправку листа',
    example:
      'Лист для підтвердження електронної адреси надіслано повторно',
  })
  message!: string;
}