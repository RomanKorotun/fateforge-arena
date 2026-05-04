import { ApiProperty } from '@nestjs/swagger';

export class AddAddressUnauthorizedResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 401 })
  status!: number;

  @ApiProperty({ description: 'Текст помилки', example: 'Invalid credentials' })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/api/users/me/address',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2025-07-04T13:06:18.729Z',
  })
  timestamp!: string;
}
