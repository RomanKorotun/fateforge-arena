import { ApiProperty } from '@nestjs/swagger';

export class PlaceBetBadRequestResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 400 })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: [
      'Bets cannot be empty',
      'Amount must be at least 1',
      'Invalid bet type',
      'Value is required for STRAIGHT bet',
    ],
  })
  message!: string | string[];

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/roulette/bet',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-06T11:42:20.098Z',
  })
  timestamp!: string;
}
