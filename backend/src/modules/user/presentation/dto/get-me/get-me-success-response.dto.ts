import { ApiProperty } from '@nestjs/swagger';

class UserProfileDto {
  @ApiProperty({ description: 'Рейтинг користувача', example: 0 })
  rating!: number;

  @ApiProperty({ description: 'Баланс користувача', example: '0' })
  balance!: string;

  @ApiProperty({ description: 'Рівень користувача', example: 0 })
  level!: number;

  @ApiProperty({
    description: 'Аватар користувача',
    example: '60ab4201-avatar.jpg',
  })
  avatar!: string;
}

export class GetMeSuccessResponseDto {
  @ApiProperty({ description: 'Імʼя користувача', example: 'Roman' })
  username!: string;

  @ApiProperty({ description: 'Профіль користувача', type: UserProfileDto })
  profile!: UserProfileDto;
}
