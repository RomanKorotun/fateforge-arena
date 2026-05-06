import { ApiProperty } from '@nestjs/swagger';

export class PlaceBetNotFoundResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 404 })
  statusCode!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: 'Game session not found',
  })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/roulette/bet',
  })
  path!: string;

  @ApiProperty({
    description: 'Час помилки',
    example: '2026-05-06T11:00:00.000Z',
  })
  timestamp!: string;
}
