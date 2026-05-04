import { ApiProperty } from '@nestjs/swagger';

export class RevokeUserSessionSuccessResponseDto {
  @ApiProperty({
    description: 'ID сесії, яку було відкликано',
    example: '36c61bcd-fdb4-48b4-8737-92f043ebda43',
  })
  sessionId!: string;

  @ApiProperty({
    description: 'Статус операції',
    example: 'revoked',
  })
  status!: string;
}
