import { ApiProperty } from '@nestjs/swagger';

export class ResendEmailVerificationNotFoundResponseDto {
  @ApiProperty({
    description: 'Статус відповіді',
    example: 404,
  })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: 'Користувача не знайдено',
  })
  message!: string;

  @ApiProperty({
    description: 'URL запиту',
    example: '/api/auth/email-verification/resend',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-08T10:30:00.000Z',
  })
  timestamp!: string;
}
