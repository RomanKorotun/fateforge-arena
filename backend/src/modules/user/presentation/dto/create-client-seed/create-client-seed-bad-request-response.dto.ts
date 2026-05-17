import { ApiProperty } from '@nestjs/swagger';

export class CreateClientSeedBadRequestResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 400 })
  status!: number;

  @ApiProperty({
    description: 'Список помилок валідації',
    example: ['clientSeed не може бути пустим', 'clientSeed має бути рядком'],
  })
  message!: string | string[];

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/api/users/me/client-seed',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2025-07-04T13:06:18.729Z',
  })
  timestamp!: string;
}
