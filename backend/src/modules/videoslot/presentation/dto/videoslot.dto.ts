import {
  IsInt,
  IsArray,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlayVideoSlotDto {
  @ApiProperty({
    example: 'wallet_123',
    description: 'ID гаманця користувача',
  })
  @IsString()
  walletId!: string;

  @ApiProperty({
    example: 100,
    description: 'Загальна ставка (буде поділена на лінії)',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  bet!: number;

  @ApiProperty({
    example: [1, 3, 5, 7],
    description: 'ID ліній для ставки (від 1 до 15)',
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  @Min(1, { each: true })
  @Max(15, { each: true })
  lines!: number[];
}