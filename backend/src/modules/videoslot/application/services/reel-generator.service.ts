import { Injectable } from '@nestjs/common';

import { WILD_SYMBOL } from '../../domain/constants/videoslots.constants';

@Injectable()
export class ReelGeneratorService {
  generate(mode: number): number[][] {
    const reels: number[][] = [];
    const length = mode === 1 ? 256 : 16;

    for (let i = 0; i < 5; i++) {
      const reel: number[] = [];

      for (let j = 0; j < length; j++) {
        const symbolPool =
          mode === 1 ? [1, 2, 3, 4, 5, WILD_SYMBOL] : [1, 2, WILD_SYMBOL];

        const randomIndex = Math.floor(Math.random() * symbolPool.length);

        reel.push(symbolPool[randomIndex]);
      }

      reels.push(reel);
    }

    return reels;
  }
}
