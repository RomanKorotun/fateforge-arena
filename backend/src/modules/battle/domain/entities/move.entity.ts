import { Zone } from '../enums/zone.enum';

export class Move {
  constructor(
    public playerId: string,
    public attackZone: Zone,
    public defenseZone: Zone,
    public round: number,
    public strike: number,
    public hpBefore: number,
    public hpAfter: number,
    public damage: number,
  ) {}
}
