export interface SetOnlineData {
  id: string;
  username: string;
}

export interface getOnlineUsersResponse {
  id: string;
  username: string;
}

export interface PlayerRepositoryInterface {
  // користувач зайшов в гру
  setOnline(data: SetOnlineData): Promise<void>;

  // користувач вийшов
  setOffline(userId: string): Promise<void>;

  // всі онлайн користувачі
  getOnlineUsers(): Promise<getOnlineUsersResponse[]>;
}
