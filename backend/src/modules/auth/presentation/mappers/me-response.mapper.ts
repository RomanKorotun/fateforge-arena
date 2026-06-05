import { AuthUser } from '../../../../common/types/auth-request';

export const CurrentResponseMapper = {
  toResponse(user: AuthUser) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  },
};
