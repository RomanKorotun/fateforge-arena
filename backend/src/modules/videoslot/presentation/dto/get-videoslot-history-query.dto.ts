import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { DateRangeDto } from '../../../../common/dto/date-range.dto';

import { Currency } from '../../../finance/domain/enums/currency.enum';

export class GetVideoslotHistoryQueryDto extends IntersectionType(
  PaginationDto,
  DateRangeDto,
) {
  @ApiPropertyOptional({ description: 'User ID (ADMIN only)' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Game ID' })
  @IsOptional()
  @IsUUID()
  gameId?: string;

  @ApiPropertyOptional({
    enum: Currency,
    description: 'Валюта',
    example: Currency.UAH,
  })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
