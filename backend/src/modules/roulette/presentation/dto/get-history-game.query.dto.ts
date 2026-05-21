import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BetType } from '../../domain/enums/bet-type-enum';

export class GetHistoryGameQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ example: 30 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  limit: number = 30;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gameSessionId?: string;

  @ApiPropertyOptional({ description: 'ADMIN only' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  // 🔥 ENUM DROPDOWN В SWAGGER
  @ApiPropertyOptional({ enum: BetType })
  @IsEnum(BetType)
  @IsOptional()
  betType?: BetType;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  to?: string;
}
