export class Player {
  constructor(
    public id: number,
    public username: string,
    public isOnline: boolean = false,
    public currentRoomId: string | null = null,
  ) {}
}
