import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';

import { BetType } from '../../domain/enums/bet-type-enum';

import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { DateRangeDto } from '../../../../common/dto/date-range.dto';

export class GetHistoryGameQueryDto extends IntersectionType(
  PaginationDto,
  DateRangeDto,
) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gameSessionId?: string;

  @ApiPropertyOptional({ description: 'ADMIN only' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ enum: BetType })
  @IsEnum(BetType)
  @IsOptional()
  betType?: BetType;
}
