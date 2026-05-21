import { ApiProperty } from '@nestjs/swagger';

export class GetTransactionsUnauthorizedResponseDto {
  @ApiProperty({ example: 401 })
  status!: number;

  @ApiProperty({ example: 'Unauthorized' })
  message!: string;

  @ApiProperty({ example: '/api/transactions' })
  url!: string;

  @ApiProperty({ example: '2026-05-20T10:15:00.000Z' })
  timestamp!: string;
}
