import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BanUserSuccessResponseDto } from '../dto/ban-user/ban-user-success-response.dto';
import { BanUserUnauthorizedResponseDto } from '../dto/ban-user/ban-user-unauthorized-response.dto';
import { BanUserForbiddenResponseDto } from '../dto/ban-user/ban-user-forbidden-response.dto';

export const BanUserSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Заблокувати користувача',
      description:
        'Блокує користувача за його ID. Доступний лише для користувачів з роллю ADMIN.',
    }),

    ApiOkResponse({
      type: BanUserSuccessResponseDto,
      description: 'Користувач успішно заблокований',
    }),

    ApiUnauthorizedResponse({
      type: BanUserUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),

    ApiForbiddenResponse({
      type: BanUserForbiddenResponseDto,
      description: 'Доступ заборонено (користувач не має прав ADMIN)',
    }),
  );
};
