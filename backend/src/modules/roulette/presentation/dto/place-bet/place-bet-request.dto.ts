import {
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsDefined,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

import { BetType } from '../../../domain/enums/bet-type-enum';

class BetDto {
  @IsEnum(BetType, { message: 'Invalid bet type' })
  type!: BetType;

  @IsOptional()
  @IsInt({ message: 'Value must be a number' })
  @Min(0, { message: 'Value must be >= 0' })
  @Max(36, { message: 'Value must be <= 36' })
  value?: number;

  @IsInt({ message: 'Amount must be a number' })
  @Min(1, { message: 'Amount must be at least 1' })
  amount!: number;
}

export class PlaceBetDto {
  @IsString({ message: 'SessionId must be a string' })
  gameSessionId!: string;

  @IsDefined({ message: 'Bets are required' })
  @IsArray({ message: 'Bets must be an array' })
  @ArrayNotEmpty({ message: 'Bets cannot be empty' })
  @ValidateNested({ each: true })
  @Type(() => BetDto)
  bets!: BetDto[];
}