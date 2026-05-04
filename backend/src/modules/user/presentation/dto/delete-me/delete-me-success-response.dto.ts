import { ApiProperty } from '@nestjs/swagger';

export class DeleteMeSuccessResponseDto {
  @ApiProperty({
    description: 'Повідомлення про успішне видалення акаунта',
    example: 'Account deleted successfully',
  })
  message!: string;
}
