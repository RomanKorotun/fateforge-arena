export class ProfileEntity {
  constructor(
    public readonly userId: string,
    public readonly rating: number,
    public readonly level: number,
    public readonly avatar: string | null,
  ) {}
}
