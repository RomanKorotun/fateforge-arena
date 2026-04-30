import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthRequest, AuthUser } from '../../../../common/types/auth-request';

export const CurrentUser = createParamDecorator(
  <K extends keyof AuthUser>(
    data: K | undefined,
    ctx: ExecutionContext,
  ): AuthUser[K] | AuthUser => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();

    const user = request.user;

    return data ? user?.[data] : user;
  },
);
