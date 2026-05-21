import { ApiProperty } from '@nestjs/swagger';

export class GetTransactionsBadRequestResponseDto {
  @ApiProperty({ example: 400 })
  status!: number;

  @ApiProperty({
    example: 'Invalid query parameters (page, limit, date range)',
  })
  message!: string;

  @ApiProperty({ example: '/api/transactions' })
  url!: string;

  @ApiProperty({ example: '2026-05-20T10:15:00.000Z' })
  timestamp!: string;
}
