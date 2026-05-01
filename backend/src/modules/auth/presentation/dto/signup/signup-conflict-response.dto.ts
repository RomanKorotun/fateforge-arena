import { ApiProperty } from '@nestjs/swagger';

export class SignupConflictResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 409 })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: 'Користувач з email test@gmail.com уже існує в базі',
  })
  message!: string;

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/api/auth/signup',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2025-07-04T13:06:18.729Z',
  })
  timestamp!: string;
}
