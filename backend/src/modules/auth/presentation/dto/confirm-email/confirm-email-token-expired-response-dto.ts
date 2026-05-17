import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailTokenExpiredResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 410 })
  status!: number;

  @ApiProperty({ description: 'Текст помилки', example: 'Token expired' })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/api/auth/confirm-email',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-01T09:44:32.421Z',
  })
  timestamp!: string;
}
