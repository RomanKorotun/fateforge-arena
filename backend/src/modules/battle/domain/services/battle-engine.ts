import { BattleRoom } from '../entities/battle-room.entity';
import { BattleStatus } from '../enums/battle-status.enum';
import { Move } from '../entities/move.entity';
import { Zone } from '../enums/zone.enum';

export class BattleEngine {
  public readonly INITIAL_HEALTH = 10;
  public readonly ROUND_DURATION = 10000;

  private readonly BLOCK_REDUCTION = 1;

  private zones: Zone[] = [Zone.HEAD, Zone.BODY, Zone.LEGS];

  private randomZone(): Zone {
    return this.zones[Math.floor(Math.random() * this.zones.length)];
  }

  private autoMove(userId: string, round: number, hpBefore: number): Move {
    return new Move(
      userId,
      this.randomZone(),
      this.randomZone(),
      round,
      1,
      hpBefore,
      hpBefore,
      0,
    );
  }

  private calcDamage(attack: Zone, defense: Zone, strike: number): number {
    if (attack === defense) return Math.max(0, strike - this.BLOCK_REDUCTION);
    return strike;
  }

  processRound(room: BattleRoom): BattleRoom {
    if (room.status === BattleStatus.FINISHED) return room;

    const round = room.currentRound;

    const p1Before = room.player1Health;
    const p2Before = room.player2Health;

    const p1Move =
      room.player1RoundMove ?? this.autoMove(room.player1Id, round, p1Before);

    const p2Move =
      room.player2RoundMove ?? this.autoMove(room.player2Id, round, p2Before);

    const dmgToP1 = this.calcDamage(
      p2Move.attackZone,
      p1Move.defenseZone,
      p2Move.strike,
    );

    const dmgToP2 = this.calcDamage(
      p1Move.attackZone,
      p2Move.defenseZone,
      p1Move.strike,
    );

    const p1After = Math.max(0, p1Before - dmgToP1);
    const p2After = Math.max(0, p2Before - dmgToP2);

    room.player1MovesHistory.push(
      new Move(
        p1Move.playerId,
        p1Move.attackZone,
        p1Move.defenseZone,
        round,
        p1Move.strike,
        p1Before,
        p1After,
        dmgToP1,
      ),
    );

    room.player2MovesHistory.push(
      new Move(
        p2Move.playerId,
        p2Move.attackZone,
        p2Move.defenseZone,
        round,
        p2Move.strike,
        p2Before,
        p2After,
        dmgToP2,
      ),
    );

    room.player1Health = p1After;
    room.player2Health = p2After;

    if (p1After <= 0 || p2After <= 0) {
      room.status = BattleStatus.FINISHED;
      room.winnerId =
        p1After === p2After
          ? null
          : p1After <= 0
            ? room.player2Id
            : room.player1Id;

      return room;
    }

    room.currentRound += 1;

    room.player1RoundMove = null;
    room.player2RoundMove = null;

    room.roundDeadline = Date.now() + this.ROUND_DURATION;

    return room;
  }

  createRoom(id: string, p1: string, p2: string): BattleRoom {
    return new BattleRoom(
      id,
      p1,
      p2,
      BattleStatus.ACTIVE,
      Date.now(),
      1,
      Date.now() + this.ROUND_DURATION,
      this.INITIAL_HEALTH,
      this.INITIAL_HEALTH,
      null,
      null,
      [],
      [],
      null,
    );
  }
}
