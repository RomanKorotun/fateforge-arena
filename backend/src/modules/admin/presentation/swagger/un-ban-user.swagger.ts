import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UnBanUserSuccessResponseDto } from '../dto/un-ban-user/un-ban-user-success-response.dto';
import { UnBanUserUnauthorizedResponseDto } from '../dto/un-ban-user/un-ban-user-unauthorized-response.dto';
import { UnBanUserForbiddenResponseDto } from '../dto/un-ban-user/un-ban-user-forbidden-response.dto';

export const UnBanUserSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Зняти бан з користувача',
      description:
        'Знімає бан з користувача за його ID. Доступний лише для користувачів з роллю ADMIN.',
    }),

    ApiOkResponse({
      type: UnBanUserSuccessResponseDto,
      description: 'Користувач успішно розблокований',
    }),

    ApiUnauthorizedResponse({
      type: UnBanUserUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),

    ApiForbiddenResponse({
      type: UnBanUserForbiddenResponseDto,
      description: 'Доступ заборонено (користувач не має прав ADMIN)',
    }),
  );
};
