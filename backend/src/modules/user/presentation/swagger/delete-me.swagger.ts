import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DeleteMeSuccessResponseDto } from '../dto/delete-me/delete-me-success-response.dto';
import { DeleteMeUnauthorizedResponseDto } from '../dto/delete-me/delete-me-unauthorized-response.dto';

export const DeleteMeSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Видалити акаунт користувача (SOFT DELETE)',
      description:
        'Виконує soft delete акаунта поточного користувача. Користувач позначається як видалений, але дані не видаляються фізично.',
    }),

    ApiOkResponse({
      type: DeleteMeSuccessResponseDto,
      description: 'Акаунт користувача успішно видалено',
    }),

    ApiUnauthorizedResponse({
      type: DeleteMeUnauthorizedResponseDto,
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
