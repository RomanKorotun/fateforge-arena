import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { CreateClientSeedSuccessResponseDto } from '../dto/create-client-seed/create-client-seed-success-response.dto';
import { CreateClientSeedUnauthorizedResponseDto } from '../dto/create-client-seed/create-client-seed-unauthorized-response.dto';
import { CreateClientSeedBadRequestResponseDto } from '../dto/create-client-seed/create-client-seed-bad-request-response.dto';

export const CreateClientSeedSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Створити client seed користувача',
      description:
        'Встановлює clientSeed для провайблі фейр системи користувача.',
    }),

    ApiOkResponse({
      type: CreateClientSeedSuccessResponseDto,
      description: 'Client seed успішно створено',
    }),

    ApiUnauthorizedResponse({
      type: CreateClientSeedUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),

    ApiBadRequestResponse({
      type: CreateClientSeedBadRequestResponseDto,
      description:
        'Некоректні дані запиту (clientSeed пустий або невалідний формат)',
    }),
  );
};
