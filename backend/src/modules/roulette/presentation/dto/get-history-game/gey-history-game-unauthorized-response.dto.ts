import { ApiProperty } from '@nestjs/swagger';

export class GetHistoryGameUnauthorizedResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 401 })
  status!: number;

  @ApiProperty({ description: 'Текст помилки', example: 'Unauthorized' })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/roulette/history',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-06T11:20:00.000Z',
  })
  timestamp!: string;
}
