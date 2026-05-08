import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { UpdateClientSeedSuccessResponseDto } from '../dto/update-client-seed/update-client-seed-success-response.dto';
import { UpdateClientSeedUnauthorizedResponseDto } from '../dto/update-client-seed/update-client-seed-unauthorized-response.dto';
import { UpdateClientSeedBadRequestResponseDto } from '../dto/update-client-seed/update-client-seed-bad-request-response.dto';

export const UpdateClientSeedSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Оновити client seed користувача',
      description: 'Оновлює clientSeed для провайблі фейр системи користувача.',
    }),

    ApiOkResponse({
      type: UpdateClientSeedSuccessResponseDto,
      description: 'Client seed успішно оновлено',
    }),

    ApiUnauthorizedResponse({
      type: UpdateClientSeedUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),

    ApiBadRequestResponse({
      type: UpdateClientSeedBadRequestResponseDto,
      description:
        'Некоректні дані запиту (clientSeed пустий або невалідний формат)',
    }),
  );
};
