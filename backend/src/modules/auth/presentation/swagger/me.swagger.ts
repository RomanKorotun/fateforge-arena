import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { MeSuccessResponseDto } from '../dto/me/me-success-response.dto';
import { MeUnauthorizedResponseDto } from '../dto/me/me-unauthorized-response.dto';

export const MeSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Повертає поточного користувача',
      description:
        'Повертає публічну інформацію про поточного авторизованого користувача',
    }),
    ApiOkResponse({
      type: MeSuccessResponseDto,
      description: 'Успішна відповідь із даними поточного користувача',
    }),
    ApiUnauthorizedResponse({
      type: MeUnauthorizedResponseDto,
      description:
        'Користувач не аутентифікований (не передано або недійсний токен)',
    }),
  );
};
