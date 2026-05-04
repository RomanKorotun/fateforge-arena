import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetMeUnauthorizedResponseDto } from '../dto/get-me/get-me-unauthorized-response.dto';
import { GetMeSuccessResponseDto } from '../dto/get-me/get-me-success-response.dto';

export const GetMeSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати інформацію про себе',
      description: `Повертає повний профіль авторизованого користувача (username, profile).`,
    }),

    ApiOkResponse({
      type: GetMeSuccessResponseDto,
      description: 'Профіль користувача успішно отримано',
    }),

    ApiUnauthorizedResponse({
      type: GetMeUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
