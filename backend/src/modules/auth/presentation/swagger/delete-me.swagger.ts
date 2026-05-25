import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DeleteAccountSuccessResponseDto } from '../dto/delete-account/delete-account-success-response.dto';
import { DeleteAccountUnauthorizedResponseDto } from '../dto/delete-account/delete-account-unauthorized-response.dto';

export const DeleteMeSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Видалити акаунт користувача (SOFT DELETE)',
      description:
        'Виконує soft delete акаунта поточного користувача. Користувач позначається як видалений, але дані не видаляються фізично.',
    }),

    ApiOkResponse({
      type: DeleteAccountSuccessResponseDto,
      description: 'Акаунт користувача успішно видалено',
    }),

    ApiUnauthorizedResponse({
      type: DeleteAccountUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
