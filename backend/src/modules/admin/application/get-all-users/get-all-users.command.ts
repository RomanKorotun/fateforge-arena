export interface GetAllUsersCommand {
  page: number;
  limit: number;
  isBanned?: boolean;
  isDeleted?: boolean;
}
