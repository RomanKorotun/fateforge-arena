import { ApiProperty } from '@nestjs/swagger';

export class MeSuccessResponseDto {
  @ApiProperty({ description: 'Ім"я користувача', example: 'Roman' })
  username!: string;

  @ApiProperty({
    description: 'Email користувача',
    example: 'test@gmail.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Role користувача',
    example: 'USER',
  })
  role!: string;
}
