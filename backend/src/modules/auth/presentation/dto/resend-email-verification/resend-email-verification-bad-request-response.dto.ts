import { ApiProperty } from '@nestjs/swagger';

export class ResendEmailVerificationBadRequestResponseDto {
  @ApiProperty({
    description: 'Статус відповіді',
    example: 400,
  })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки',
    example: 'Email вже підтверджено',
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
