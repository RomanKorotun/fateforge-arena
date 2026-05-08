export class UserSeedEntity {
  constructor(
    public readonly userId: string,
    public clientSeed: string,
  ) {}

  changeSeed(newSeed: string) {
    this.clientSeed = newSeed;
  }
}
