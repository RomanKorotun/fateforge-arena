import { ApiProperty } from '@nestjs/swagger';

export class GetUserWalletsUnauthorizedResponseDto {
  @ApiProperty({
    description: 'HTTP статус код',
    example: 401,
  })
  status!: number;

  @ApiProperty({
    description: 'Повідомлення про помилку',
    example: 'Unauthorized',
  })
  message!: string;

  @ApiProperty({
    description: 'URL запиту',
    example: '/api/wallets',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-20T10:15:00.000Z',
  })
  timestamp!: string;
}
