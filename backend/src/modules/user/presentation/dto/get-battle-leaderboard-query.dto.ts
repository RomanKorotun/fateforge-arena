import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../../../common/dto/pagination.dto';

export class GetBattleLeaderboardQueryDto extends IntersectionType(
  PaginationDto,
) {}
