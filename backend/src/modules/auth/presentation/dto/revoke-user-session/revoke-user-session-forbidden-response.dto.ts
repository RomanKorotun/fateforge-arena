import { ApiProperty } from '@nestjs/swagger';

export class RevokeUserSessionForbiddenResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 403 })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: 'Forbidden',
  })
  message!: string;

  @ApiProperty({
    description: 'URL, на який був зроблений запит',
    example: '/api/auth/sessions/{id}/revoke',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-01T15:07:42.621Z',
  })
  timestamp!: string;
}
