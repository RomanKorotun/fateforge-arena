import { ApiProperty } from '@nestjs/swagger';

export class LeaveGameForbiddenResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 403 })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: 'You have no access to this session',
  })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/roulette/leave/{id}',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-06T10:25:30.000Z',
  })
  timestamp!: string;
}
