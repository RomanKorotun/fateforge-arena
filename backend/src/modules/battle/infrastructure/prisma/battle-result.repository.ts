import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../core/prisma/prisma.service';
import type {
  BattleResultData,
  IBattleResultRepository,
} from '../../domain/repositories/battle-result/battle-result.repository';

@Injectable()
export class PrismaBattleResultRepository implements IBattleResultRepository {
  constructor(private readonly prisma: PrismaService) {}

  // зберегти результати бою
  async save(data: BattleResultData): Promise<void> {
    await this.prisma.battleResult.create({ data });
  }
}
