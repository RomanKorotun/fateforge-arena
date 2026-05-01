import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetAllUsersSuccessResponseDto } from '../dto/get-all-users/get-all-users-success-response.dto';
import { GetAllUsersUnauthorizedResponseDto } from '../dto/get-all-users/get-all-users-unauthorized-response.dto';
import { GetAllUsersForbiddenResponseDto } from '../dto/get-all-users/get-all-users-forbidden-response.dto';

export const GetAllUsersSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати список всіх користувачів',
      description:
        'Повертає список усіх користувачів системи. Доступний лише для користувачів з роллю ADMIN.',
    }),

    ApiOkResponse({
      type: GetAllUsersSuccessResponseDto,
      isArray: true,
      description: 'Список користувачів',
    }),

    ApiUnauthorizedResponse({
      type: GetAllUsersUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),

    ApiForbiddenResponse({
      type: GetAllUsersForbiddenResponseDto,
      description: 'Доступ заборонено (користувач не має прав ADMIN)',
    }),
  );
};
