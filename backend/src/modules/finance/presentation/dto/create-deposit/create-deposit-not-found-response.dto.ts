import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositNotFoundResponseDto {
  @ApiProperty({ example: 404 })
  status!: number;

  @ApiProperty({ example: 'Гаманець не знайдено' })
  message!: string;

  @ApiProperty({ example: '/api/finance/create-deposit' })
  url!: string;

  @ApiProperty({ example: '2026-05-20T10:00:00.000Z' })
  timestamp!: string;
}
