import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarBadRequestResponseDto {
  @ApiProperty({ description: 'Статус відповіді', example: 400 })
  status!: number;

  @ApiProperty({
    description: 'Текст помилки або список помилок валідації файлу',
    example: [
      'Avatar is required',
      'Only image files are allowed',
      'File too large (max 5MB)',
    ],
  })
  message!: string | string[];

  @ApiProperty({
    description: 'URL на який був зроблений запит',
    example: '/api/users/me/profile/avatar',
  })
  url!: string;

  @ApiProperty({
    description: 'Час виникнення помилки',
    example: '2026-05-01T13:06:18.729Z',
  })
  timestamp!: string;
}
