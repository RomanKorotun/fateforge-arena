import { UserRole } from '../../domain/enums/user-role.enum';

export const UserRoleMapper = {
  toApi(role: UserRole): 'USER' | 'ADMIN' {
    switch (role) {
      case UserRole.USER:
        return 'USER';
      case UserRole.ADMIN:
        return 'ADMIN';
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  },
};
