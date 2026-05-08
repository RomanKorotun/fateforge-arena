import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailNotFoundResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 404 })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: 'Invalid token',
  })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/api/users/confirm-email',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-01T09:44:32.421Z',
  })
  timestamp!: string;
}
