import { ApiProperty } from '@nestjs/swagger';

export class GetWalletNotFoundResponseDto {
  @ApiProperty({
    description: 'HTTP статус код',
    example: 404,
  })
  status!: number;

  @ApiProperty({
    description: 'Повідомлення про помилку',
    example: 'Wallet not found',
  })
  message!: string;

  @ApiProperty({
    description: 'URL запиту',
    example: '/api/wallet/288ec5f1-f63f-49e5-8b76-901f46577320',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-20T10:15:00.000Z',
  })
  timestamp!: string;
}
