import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetAddressSuccessResponseDto } from '../dto/get-address/get-address-success-response.dto';
import { GetAddressUnauthorizedResponseDto } from '../dto/get-address/get-address-unauthorized-response.dto';

export const GetAddressSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримати адресу користувача',
      description:
        'Повертає адресу для авторизованого користувача. Якщо адреса ще не заповнена — повертає `null`.',
    }),

    ApiOkResponse({
      type: GetAddressSuccessResponseDto,
      description:
        'Адреса успішно знайдена та повернена, або null якщо ще не заповнена',
    }),

    ApiUnauthorizedResponse({
      type: GetAddressUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
