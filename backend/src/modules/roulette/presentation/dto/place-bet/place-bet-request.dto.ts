import {
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsInt,
  Min,
  Max,
  ValidateNested,
  IsString,
  IsOptional,
  ValidateIf, // 👈 додано
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BetType } from '../../../domain/enums/bet-type-enum';

class BetDto {
  @ApiProperty({
    description: 'Тип ставки',
    enum: BetType,
    example: BetType.STRAIGHT,
  }) // опис для Swagger
  @IsEnum(BetType, { message: 'Invalid bet type' }) // перевірка що тип існує в enum
  type!: BetType; // тип ставки (RED/BLACK/STRAIGHT)

  @ApiProperty({
    description: 'Значення ставки (тільки для STRAIGHT)',
    example: 17,
    required: false,
  }) // опис для Swagger
  @ValidateIf((o) => o.type === BetType.STRAIGHT) // value тільки для STRAIGHT
  @IsOptional() // поле може бути відсутнє
  @IsInt({ message: 'Value must be a number' }) // має бути цілим числом
  @Min(0) // мінімальне значення рулетки
  @Max(36) // максимальне значення рулетки
  value?: number; // число для STRAIGHT ставки

  @ApiProperty({ description: 'Сума ставки', example: 100 }) // опис для Swagger
  @IsInt({ message: 'Amount must be a number' }) // тільки integer
  @Min(1, { message: 'Amount must be at least 1' }) // мінімальна ставка
  amount!: number; // сума ставки
}

export class PlaceBetRequestDto {
  @ApiProperty({
    description: 'ID ігрової сесії',
    example: 'game_session_123',
  }) // опис для Swagger
  @IsString({ message: 'SessionId must be a string' }) // перевірка string
  gameSessionId!: string; // id сесії гри

  @ApiProperty({
    description: 'Список ставок',
    type: () => BetDto,
    isArray: true,
  })
  @IsArray({ message: 'Bets must be an array' }) // перевірка що це масив
  @ArrayNotEmpty({ message: 'Bets cannot be empty' }) // масив не може бути пустим
  @ValidateNested({ each: true }) // перевіряє кожен BetDto всередині
  @Type(() => BetDto) // трансформує plain object → BetDto class
  bets!: BetDto[]; // список ставок користувача
}
