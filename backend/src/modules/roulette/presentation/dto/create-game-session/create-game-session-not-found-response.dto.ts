import { ApiProperty } from '@nestjs/swagger';

export class CreateGameSessionNotFoundResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 404 })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: 'clientSeed не знайдено',
  })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/roulette/join',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-06T11:20:00.000Z',
  })
  timestamp!: string;
}
