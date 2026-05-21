import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositBadRequestResponseDto {
  @ApiProperty({ example: 400 })
  status!: number;

  @ApiProperty({ example: 'Unsupported provider' })
  message!: string;

  @ApiProperty({ example: '/api/finance/create-deposit' })
  url!: string;

  @ApiProperty({ example: '2026-05-20T10:00:00.000Z' })
  timestamp!: string;
}
