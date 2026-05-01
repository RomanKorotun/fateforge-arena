import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AddAddressSuccessResponseDto } from '../dto/add-address/add-address-success-response.dto';
import { AddAddressUnauthorizedResponseDto } from '../dto/add-address/add-address-unauthorized-response.dto';

export const AddAddressSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Додати адресу користувачу',
      description:
        'Додає адресу для авторизованого користувача. Користувач ідентифікується через accessToken.',
    }),

    ApiCreatedResponse({
      type: AddAddressSuccessResponseDto,
      description: 'Адреса успішно додана або оновлена',
    }),

    ApiUnauthorizedResponse({
      type: AddAddressUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
