import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RevokeUserSessionsSuccessResponseDto } from '../dto/revoke-user-sessions/revoke-user-sessions-success-response.dto';
import { RevokeUserSessionsUnauthorizedResponseDto } from '../dto/revoke-user-sessions/revoke-user-sessions-unauthorized-response.dto';

export const RevokeUserSessionsSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Відкликати всі сесії користувача',
      description:
        'Видаляє (відкликає) всі активні сесії поточного користувача. Після виконання користувач буде розлогінений на всіх пристроях.',
    }),

    ApiOkResponse({
      type: RevokeUserSessionsSuccessResponseDto,
      description: 'Всі сесії користувача успішно відкликані',
    }),

    ApiUnauthorizedResponse({
      type: RevokeUserSessionsUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
