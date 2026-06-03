export interface PlaySpinCommand {
  userId: string;
  data: {
    bet: number;
    lines: number[];
  };
}
