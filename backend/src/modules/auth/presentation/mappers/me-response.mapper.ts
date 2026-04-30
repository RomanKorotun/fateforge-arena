import { UserRoleMapper } from '../../../user/application/mappers/user-role.mapper';
import { AuthUser } from '../../../../common/types/auth-request';

export const MeResponseMapper = {
  toResponse(user: AuthUser) {
    return {
      username: user.username,
      email: user.email,
      role: UserRoleMapper.toApi(user.role),
    };
  },
};
