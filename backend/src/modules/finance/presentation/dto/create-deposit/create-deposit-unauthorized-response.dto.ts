import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositUnauthorizedResponseDto {
  @ApiProperty({ example: 401 })
  status!: number;

  @ApiProperty({ example: 'Unauthorized' })
  message!: string;

  @ApiProperty({ example: '/api/finance/create-deposit' })
  url!: string;

  @ApiProperty({ example: '2026-05-20T10:00:00.000Z' })
  timestamp!: string;
}
