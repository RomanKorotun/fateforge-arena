import { ApiProperty } from '@nestjs/swagger';

export class GetHistoryGameSuccessResponseDto {
  @ApiProperty({
    description: 'ID ставки',
    example: 'e6155393-72ad-41ef-822c-c31614605135',
  })
  id!: string;

  @ApiProperty({
    description: 'ID ігрової сесії (spin)',
    example: '2a3efd55-7e43-4b22-b2cc-b9c70105133d',
  })
  gameSessionId!: string;

  @ApiProperty({ description: 'Номер раунду (nonce спіну)', example: 7 })
  round!: number;

  @ApiProperty({ description: 'Тип ставки', example: 'EVEN' })
  betType!: string;

  @ApiProperty({
    description:
      'Значення ставки (для number bet), null якщо не застосовується',
    example: null,
    nullable: true,
  })
  betValue!: number | null;

  @ApiProperty({ description: 'Сума ставки', example: 30 })
  amount!: number;

  @ApiProperty({ description: 'Виграшне число', example: 27 })
  winningNumber!: number;

  @ApiProperty({ description: 'Сума виплати', example: 0 })
  payoutAmount!: number;

  @ApiProperty({ description: 'Чи виграла ставка', example: false })
  isWin!: boolean;

  @ApiProperty({ description: 'Прибуток (payout - amount)', example: -30 })
  profit!: number;

  @ApiProperty({
    description: 'Дата створення ставки',
    example: '2026-05-05T18:32:22.688Z',
  })
  createdAt!: Date;
}
