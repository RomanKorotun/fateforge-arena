import { ApiProperty } from '@nestjs/swagger';

export class RevokeUserSessionBadRequestResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 400 })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: 'Invalid id format',
  })
  message!: string;

  @ApiProperty({
    description: 'URL, на який був зроблений запит',
    example: '/api/auth/sessions/{id}/revoke',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-04T06:35:43.266Z',
  })
  timestamp!: string;
}
