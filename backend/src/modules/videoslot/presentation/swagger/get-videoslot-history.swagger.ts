import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

export const GetVideoslotHistorySwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Отримання історії відеослота',
      description:
        'USER бачить тільки свої ігри. ADMIN може бачити всі або фільтрувати по userId/gameId.',
    }),

    ApiOkResponse({
      description: 'Історію успішно отримано.',
    }),

    ApiUnauthorizedResponse({
      description: 'Користувач не авторизований.',
    }),

    ApiForbiddenResponse({
      description: 'Немає доступу до цих даних.',
    }),
  );
};
