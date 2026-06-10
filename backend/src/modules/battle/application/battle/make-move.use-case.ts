import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Move } from '../../domain/entities/move.entity';
import { Zone } from '../../domain/enums/zone.enum';
import { BATTLE_REPOSITORY } from '../../domain/repositories/battle/battle.repository.token';
import type { IBattleRepository } from '../../domain/repositories/battle/battle.repository';

@Injectable()
export class MakeMoveUseCase {
  constructor(
    @Inject(BATTLE_REPOSITORY)
    private readonly battleRepository: IBattleRepository,
  ) {}

  async execute(dto: {
    roomId: string;
    userId: string;
    attackZone: Zone;
    defenseZone: Zone;
  }) {
    const room = await this.battleRepository.get(dto.roomId);
    if (!room) throw new NotFoundException('Battle not found');

    const round = room.currentRound;

    const move = new Move(
      dto.userId,
      dto.attackZone,
      dto.defenseZone,
      round,
      1,
      0,
      0,
      0,
    );

    if (room.player1Id === dto.userId) {
      room.player1RoundMove = move;
    } else {
      room.player2RoundMove = move;
    }

    await this.battleRepository.save(room);
    return room;
  }
}
