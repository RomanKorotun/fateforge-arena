import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressSuccessResponseDto {
  @ApiProperty({
    description: 'Повідомлення про успішне оновлення',
    example: 'Адресу успішно оновлено',
  })
  message!: string;
}
