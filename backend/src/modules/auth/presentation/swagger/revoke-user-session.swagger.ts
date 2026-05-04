import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RevokeUserSessionSuccessResponseDto } from '../dto/revoke-user-session/revoke-user-session-success-response.dto';
import { RevokeUserSessionUnauthorizedResponseDto } from '../dto/revoke-user-session/revoke-user-session-unauthorized-response.dto';
import { RevokeUserSessionForbiddenResponseDto } from '../dto/revoke-user-session/revoke-user-session-forbidden-response.dto';
import { RevokeUserSessionBadRequestResponseDto } from '../dto/revoke-user-session/revoke-user-session-bad-request-response.dto';

export const RevokeUserSessionSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Відкликати сесію користувача',
      description:
        'Видаляє (відкликає) конкретну сесію користувача за її ID. Користувач може відкликати лише власні сесії.',
    }),

    ApiParam({
      name: 'id',
      description: 'ID сесії, яку потрібно відкликати',
      example: '36c61bcd-fdb4-48b4-8737-92f043ebda43',
    }),

    ApiOkResponse({
      type: RevokeUserSessionSuccessResponseDto,
      description: 'Сесія успішно відкликана',
    }),

    ApiUnauthorizedResponse({
      type: RevokeUserSessionUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),

    ApiBadRequestResponse({
      type: RevokeUserSessionBadRequestResponseDto,
      description: 'Невірний формат ID сесії (очікується UUID)',
    }),

    ApiForbiddenResponse({
      type: RevokeUserSessionForbiddenResponseDto,
      description: 'Доступ заборонено (немає прав для відкликання цієї сесії)',
    }),
  );
};
