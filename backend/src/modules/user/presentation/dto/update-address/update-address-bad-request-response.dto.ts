import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressBadRequestResponseDto {
  @ApiProperty({ description: 'HTTP статус код', example: 400 })
  status!: number;

  @ApiProperty({
    description: 'Повідомлення про помилку',
    example: 'Запит повинен містити хоча б одне поле',
  })
  message!: string;

  @ApiProperty({
    description: 'URL запиту, який викликав помилку',
    example: '/api/users/me/address',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-02T11:52:17.683Z',
  })
  timestamp!: string;
}
