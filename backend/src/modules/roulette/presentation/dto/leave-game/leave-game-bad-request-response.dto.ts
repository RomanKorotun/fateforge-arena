import { ApiProperty } from '@nestjs/swagger';

export class LeaveGameBadRequestResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 400 })
  status!: number;

  @ApiProperty({ description: 'Текст помилки', example: 'Invalid id format' })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/roulette/leave/{id}',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-06T11:05:00.000Z',
  })
  timestamp!: string;
}
