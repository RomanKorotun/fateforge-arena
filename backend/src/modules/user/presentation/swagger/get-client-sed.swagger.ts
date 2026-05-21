import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { GetClientSeedSuccessResponseDto } from '../dto/get-client-sed/get-client-sed-success-response.dto';
import { GetClientSeedUnauthorizedResponseDto } from '../dto/get-client-sed/get-client-sed-unauthorized-response.dto';
import { GetClientSeedNotFoundResponseDto } from '../dto/get-client-sed/get-client-sed-not-found-response.dto';

export const GetClientSeedSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати client seed користувача',
      description:
        'Повертає clientSeed, який використовується для provably fair системи.',
    }),

    ApiOkResponse({
      type: GetClientSeedSuccessResponseDto,
      description: 'Client seed успішно отримано',
    }),

    ApiUnauthorizedResponse({
      type: GetClientSeedUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),

    ApiNotFoundResponse({
      type: GetClientSeedNotFoundResponseDto,
      description: 'Client seed не знайдено для користувача',
    }),
  );
};
