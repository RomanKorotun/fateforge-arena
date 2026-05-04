import { ApiProperty } from '@nestjs/swagger';

export class AddAddressBadRequestResponseDto {
  @ApiProperty({ description: 'HTTP статус код', example: 400 })
  status!: number;

  @ApiProperty({
    description: 'Повідомлення про помилку',
    example: [
      'Поле phoneNumber повинно бути рядком',
      'Поле phoneNumber не може бути пустим',
    ],
  })
  message!: string[] | string;

  @ApiProperty({
    description: 'URL запиту, який викликав помилку',
    example: '/api/users/me/address',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-02T12:11:05.905Z',
  })
  timestamp!: string;
}
