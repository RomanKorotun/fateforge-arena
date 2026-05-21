import { ApiProperty } from '@nestjs/swagger';

export class GetTransactionsForbiddenResponseDto {
  @ApiProperty({ example: 403 })
  status!: number;

  @ApiProperty({
    example: 'You cannot access other users transactions',
  })
  message!: string;

  @ApiProperty({ example: '/api/transactions' })
  url!: string;

  @ApiProperty({ example: '2026-05-20T10:15:00.000Z' })
  timestamp!: string;
}
