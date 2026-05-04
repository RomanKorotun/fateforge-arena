import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarSuccessResponseDto {
  @ApiProperty({
    description: 'URL аватара користувача',
    example: '/avatars/6fa094ca6c44-avatar.jpg',
  })
  avatarUrl!: string;

  @ApiProperty({
    description: 'Назва файлу аватара',
    example: '6fa094ca6c44-avatar.jpg',
  })
  filename!: string;
}
