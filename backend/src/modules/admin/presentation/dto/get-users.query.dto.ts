import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class GetAdminUsersQueryDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  limit: number = 20;

  @Transform(({ value }) =>
    value === undefined ? undefined : value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  isBanned?: boolean;
}
