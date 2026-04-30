export class ProfileEntity {
  constructor(
    public readonly userId: string, // ID користувача
    public readonly rating: number, // рейтинг користувача
    public readonly balance: number, // баланс
    public readonly level: number, // рівень користувача
    public readonly avatar: string | null, // аватар користувача (якщо є)
  ) {}
}
