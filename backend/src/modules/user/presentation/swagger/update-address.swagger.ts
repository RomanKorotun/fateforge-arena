import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UpdateAddressSuccessResponseDto } from '../dto/update-address/update-address-success-response.dto';
import { UpdateAddressUnauthorizedResponseDto } from '../dto/update-address/update-address-unauthorized-response.dto';
import { UpdateAddressBadRequestResponseDto } from '../dto/update-address/update-address-bad-request-response.dto';

export const UpdateAddressSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Оновити адресу користувача',
      description: 'Оновлює адресу для авторизованого користувача.',
    }),

    ApiOkResponse({
      type: UpdateAddressSuccessResponseDto,
      description: 'Адресу успішно оновлено',
    }),

    ApiBadRequestResponse({
      type: UpdateAddressBadRequestResponseDto,
      description: 'Тіло запиту не може бути пустим або некоректним',
    }),

    ApiUnauthorizedResponse({
      type: UpdateAddressUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
