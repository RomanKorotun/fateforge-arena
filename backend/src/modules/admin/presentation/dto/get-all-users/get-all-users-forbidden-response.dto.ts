import { ApiProperty } from '@nestjs/swagger';

export class GetAllUsersForbiddenResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 403 })
  status!: number;

  @ApiProperty({ description: 'Текст помилки', example: 'Access denied' })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/api/admin/users',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-01T09:44:32.421Z',
  })
  timestamp!: string;
}
