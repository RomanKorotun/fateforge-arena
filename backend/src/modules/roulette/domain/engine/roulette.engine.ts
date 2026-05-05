import crypto from 'crypto';

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

  checkWin(type: string, value: number | undefined, win: number) {
    if (type === 'STRAIGHT') return win === value;
    if (type === 'RED') return this.isRed(win);
    if (type === 'BLACK') return !this.isRed(win) && win !== 0;
    if (type === 'EVEN') return win % 2 === 0 && win !== 0;
    if (type === 'ODD') return win % 2 !== 0;
    return false;
  }

  getMultiplier(type: string) {
    return type === 'STRAIGHT' ? 36 : 2;
  }
}
