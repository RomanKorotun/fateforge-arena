import { AuthUser } from '../../../../common/types/auth-request';

export const MeResponseMapper = {
  toResponse(user: AuthUser) {
    return {
      username: user.username,
      email: user.email,
      role: user.role,
    };
  },
};
