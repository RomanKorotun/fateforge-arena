export interface PlaySpinCommand {
  userId: string;
  data: {
    walletId: string;
    bet: number;
    lines: number[];
  };
}
