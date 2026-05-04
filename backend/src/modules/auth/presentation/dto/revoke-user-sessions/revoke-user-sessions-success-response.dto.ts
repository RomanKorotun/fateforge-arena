import { ApiProperty } from '@nestjs/swagger';

export class RevokeUserSessionsSuccessResponseDto {
  @ApiProperty({
    description: 'Статус операції відкликання сесій',
    example: 'revoked',
  })
  status!: string;
}
