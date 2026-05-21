import { ApiProperty } from '@nestjs/swagger';

export class WalletDto {
  @ApiProperty({
    description: 'ID гаманця',
    example: '288ec5f1-f63f-49e5-8b76-901f46577320',
  })
  id!: string;

  @ApiProperty({
    description: 'Баланс гаманця',
    example: 0,
  })
  balance!: number;

  @ApiProperty({
    description: 'Валюта гаманця',
    example: 'UAH',
  })
  currency!: string;
}

export class GetUserWalletsSuccessResponseDto {
  @ApiProperty({
    description: 'Список гаманців користувача',
    type: [WalletDto],
  })
  wallets!: WalletDto[];
}
