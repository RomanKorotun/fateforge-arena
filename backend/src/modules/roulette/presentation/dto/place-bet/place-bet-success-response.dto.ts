import { ApiProperty } from '@nestjs/swagger';

import { BetType } from '../../../domain/enums/bet-type-enum';

export class PlaceBetSummaryDto {
  @ApiProperty({ description: 'Загальна сума ставок', example: 180 })
  totalBet!: number;

  @ApiProperty({ description: 'Загальна виплата', example: 200 })
  totalPayout!: number;

  @ApiProperty({
    description: 'Чистий результат (прибуток або збиток)',
    example: 20,
  })
  profit!: number;
}

export class PlaceBetBetItemDto {
  @ApiProperty({ description: 'Тип ставки', example: 'RED' })
  betType!: BetType;

  @ApiProperty({
    description: 'Значення ставки (якщо є)',
    example: null,
    nullable: true,
  })
  betValue!: number | null;

  @ApiProperty({ description: 'Сума ставки', example: 100 })
  amount!: number;

  @ApiProperty({ description: 'Сума виплати по ставці', example: 0 })
  payoutAmount!: number;

  @ApiProperty({ description: 'Чи виграла ставка', example: false })
  isWin!: boolean;
}

export class PlaceBetSuccessResponseDto {
  @ApiProperty({ description: 'Номер раунду', example: 3 })
  round!: number;

  @ApiProperty({ description: 'Виграшне число', example: 25 })
  winNumber!: number;

  @ApiProperty({
    description: 'Підсумок раунду',
    type: () => PlaceBetSummaryDto,
  })
  summary!: PlaceBetSummaryDto;

  @ApiProperty({
    description: 'Список ставок у цьому раунді',
    type: () => [PlaceBetBetItemDto],
  })
  bets!: PlaceBetBetItemDto[];
}
