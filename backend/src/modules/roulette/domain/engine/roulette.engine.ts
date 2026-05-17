import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

import { BetType } from '../enums/bet-type-enum';

@Injectable()
export class RouletteEngine {
  generateNumber(serverSeed: string, clientSeed: string, nonce: number) {
    const hmac = crypto.createHmac('sha256', serverSeed);
    hmac.update(`${clientSeed}:${nonce}`);
    const hash = hmac.digest('hex');
    let index = 0;

    while (true) {
      const slice = hash.substring(index, index + 8);
      const num = parseInt(slice, 16);
      if (num < 0xffffffff - (0xffffffff % 37)) {
        return num % 37;
      }
      index += 8;
    }
  }

  isRed(num: number) {
    return [
      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
    ].includes(num);
  }

  isBlack(num: number) {
    return [
      2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
    ].includes(num);
  }

  checkWin(type: BetType, value: number | undefined, win: number) {
    if (type === BetType.STRAIGHT) return win === value;
    if (type === BetType.RED) return this.isRed(win);
    if (type === BetType.BLACK) return this.isBlack(win);
    if (type === BetType.EVEN) return win !== 0 && win % 2 === 0;
    if (type === BetType.ODD) return win !== 0 && win % 2 === 1;
    return false;
  }

  getMultiplier(type: BetType) {
    return type === BetType.STRAIGHT ? 36 : 2;
  }
}
