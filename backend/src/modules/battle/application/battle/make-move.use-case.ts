import { Injectable, NotFoundException } from '@nestjs/common';

import { RedisBattleRepository } from '../../infrastructure/redis/redis-battle.repository';
import { Move } from '../../domain/entities/move.entity';
import { Zone } from '../../domain/enums/zone.enum';

@Injectable()
export class MakeMoveUseCase {
  constructor(private readonly battleRepo: RedisBattleRepository) {}

  async execute(dto: {
    roomId: string;
    userId: string;
    attackZone: Zone;
    defenseZone: Zone;
  }) {
    const room = await this.battleRepo.get(dto.roomId);
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

    await this.battleRepo.save(room);
    return room;
  }
}
