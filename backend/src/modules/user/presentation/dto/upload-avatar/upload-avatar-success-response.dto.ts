import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarSuccessResponseDto {
  @ApiProperty({
    description: 'URL аватара користувача',
    example:
      '/avatars/132d19c2-b41f-4100-80e6-6fa094ca6c44-df896405e9858e9ced7f7bcab085aa49.jpg',
  })
  avatarUrl!: string;

  @ApiProperty({
    description: 'Назва файлу аватара',
    example:
      '132d19c2-b41f-4100-80e6-6fa094ca6c44-df896405e9858e9ced7f7bcab085aa49.jpg',
  })
  filename!: string;
}
