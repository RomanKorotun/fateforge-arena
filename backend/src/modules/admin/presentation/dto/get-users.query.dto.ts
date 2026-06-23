import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

import { PaginationDto } from '../../../../common/dto/pagination.dto';

export class GetAdminUsersQueryDto extends IntersectionType(PaginationDto) {
  @ApiPropertyOptional({
    description: 'Фільтр по заблокованих користувачах',
    example: false,
  })
  @Transform(({ value }) =>
    value === undefined ? undefined : value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  isBanned?: boolean;

  @ApiPropertyOptional({
    description: 'Фільтр по видалених користувачах',
    example: false,
  })
  @Transform(({ value }) =>
    value === undefined ? undefined : value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}
