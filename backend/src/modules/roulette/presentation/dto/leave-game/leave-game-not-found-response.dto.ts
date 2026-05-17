import { ApiProperty } from '@nestjs/swagger';

export class LeaveGameNotFoundResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 404 })
  status!: number;

  @ApiProperty({ description: 'Текст помилки', example: 'Session not found' })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/roulette/leave/{id}',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-06T10:12:45.123Z',
  })
  timestamp!: string;
}
