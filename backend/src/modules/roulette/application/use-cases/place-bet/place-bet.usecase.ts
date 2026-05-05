import { Inject, Injectable } from '@nestjs/common';

import { GAME_SESSION_REPOSITORY } from '../../../domain/repositories/game-session.repository.token';
import type { IGameSessionRepository } from '../../../domain/repositories/game-session.repository';
import { PlaceBetCommand } from './place-bet-command';
import { DomainError } from '../../../../../shared/domain/errors/domain-error';


@Injectable()
export class PlaceBetUseCase {
  constructor(@Inject(GAME_SESSION_REPOSITORY)
    private readonly gameSessionRepository: IGameSessionRepository,
    // private readonly betRepo: IRouletteBetRepository,
    // private readonly engine: RouletteEngine,
  ) {}

  async execute(userId: string, {bets}: PlaceBetCommand) {
    const session = await this.gameSessionRepository.findByUserId(userId);
    if (!session) throw new DomainError('Game session not found', 404);

    session.ensureActive();
    session.validateOwnership(userId);

    const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);

    // if (user.profile.balance < totalBet) {
    //   throw new Error('Not enough balance');
    // }

    // // 4. ROULETTE RESULT
    // const winNumber = this.engine.generateNumber(
    //   session.serverSeed,
    //   session.clientSeed,
    //   session.getNonce(),
    // );

    // let totalPayout = 0;

    // const mappedBets = dto.bets.map((bet) => {
    //   const isWin = this.engine.checkWin(bet.type, bet.value, winNumber);

    //   const payout = isWin
    //     ? bet.amount * this.engine.getMultiplier(bet.type)
    //     : 0;

    //   totalPayout += payout;

    //   return {
    //     userId,
    //     gameSessionId: session.id,
    //     betType: bet.type,
    //     betValue: bet.value,
    //     amount: bet.amount,
    //     winningNumber: winNumber,
    //     payoutAmount: payout,
    //     isWin,
    //     nonce: session.getNonce(),
    //   };
    // });

    // // 5. SAVE BETS
    // await this.betRepo.createMany(mappedBets);

    // // 6. UPDATE BALANCE
    // await this.userRepo.decreaseBalance(userId, totalBet);
    // await this.userRepo.increaseBalance(userId, totalPayout);

    // // 7. UPDATE SESSION
    // session.incrementNonce();
    // await this.sessionRepo.updateNonce(session.id, session.getNonce());

    // return {
    //   winNumber,
    //   totalPayout,
    // };
  }
}