import { ApiProperty } from '@nestjs/swagger';

export class PlaceBetUnauthorizedResponseDto {
  @ApiProperty({ description: 'HTTP статус', example: 401 })
  status!: number;

  @ApiProperty({ description: 'Текст помилки', example: 'Unauthorized' })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/roulette/bet',
  })
  url!: string;

  @ApiProperty({
    description: 'Час помилки',
    example: '2026-05-06T11:00:00.000Z',
  })
  timestamp!: string;
}
