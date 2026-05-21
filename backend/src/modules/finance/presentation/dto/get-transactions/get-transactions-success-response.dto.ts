import { ApiProperty } from '@nestjs/swagger';

class TransactionResponseDto {
  @ApiProperty({ example: '8fd7e2ab-957d-4979-b7b5-98a9d38bdbcc' })
  id!: string;

  @ApiProperty({ example: 'a81eee3e-c08e-41a4-83b7-3fa3177a69ad' })
  walletId!: string;

  @ApiProperty({ example: 'DEPOSIT' })
  type!: string;

  @ApiProperty({ example: 'COMPLETED' })
  status!: string;

  @ApiProperty({ example: 25000 })
  amount!: number;

  @ApiProperty({ example: 'UAH' })
  currency!: string;

  @ApiProperty({ example: 250000 })
  balanceBefore!: number;

  @ApiProperty({ example: 275000, required: false })
  balanceAfter?: number;

  @ApiProperty({ example: 'STRIPE', required: false })
  provider?: string;

  @ApiProperty({ example: 'Deposit via STRIPE', required: false })
  description?: string;

  @ApiProperty({ example: '2026-05-21T04:47:41.956Z' })
  createdAt!: string;
}

class TransactionsPaginationDto {
  @ApiProperty({ example: 2 })
  page!: number;

  @ApiProperty({ example: 5 })
  totalItems!: number;

  @ApiProperty({ example: 3 })
  totalPages!: number;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;

  @ApiProperty({ example: true })
  hasPrevPage!: boolean;
}

export class GetTransactionsSuccessResponseDto {
  @ApiProperty({ type: [TransactionResponseDto] })
  data!: TransactionResponseDto[];

  @ApiProperty({ type: TransactionsPaginationDto })
  pagination!: TransactionsPaginationDto;
}
