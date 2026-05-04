import { ApiProperty } from '@nestjs/swagger';

export class SigninSuccessResponseDto {
  @ApiProperty({ description: 'Ім"я користувача', example: 'Test' })
  username!: string;

  @ApiProperty({ description: 'Email користувача', example: 'test@gmail.com' })
  email!: string;

  @ApiProperty({ description: 'Role користувача', example: 'USER' })
  role!: string;
}
