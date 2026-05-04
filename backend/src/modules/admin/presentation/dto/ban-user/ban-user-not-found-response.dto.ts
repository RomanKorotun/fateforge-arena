import { ApiProperty } from '@nestjs/swagger';

export class BanUserNotFoundResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 404 })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: 'User not found',
  })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/api/admin/users/{id}/ban',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-01T09:44:32.421Z',
  })
  timestamp!: string;
}
