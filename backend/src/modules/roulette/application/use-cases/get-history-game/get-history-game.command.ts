export interface GetHistoryGameCommand {
  userId: string;
  query: {
    page: number;
    limit: number;
    gameSessionId?: string;
  };
}
