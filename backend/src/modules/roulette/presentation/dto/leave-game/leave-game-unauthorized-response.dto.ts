import { ApiProperty } from '@nestjs/swagger';

export class LeaveGameUnauthorizedResponseDto {
  @ApiProperty({ description: 'HTTP статус відповіді', example: 401 })
  status!: number;

  @ApiProperty({ description: 'Текст помилки', example: 'Unauthorized' })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/roulette/leave/{id}',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-06T10:40:12.000Z',
  })
  timestamp!: string;
}
