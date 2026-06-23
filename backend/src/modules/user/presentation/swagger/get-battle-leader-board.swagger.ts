import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const GetBattleLeaderBoardSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary:
        'Отримати список користувачів з обмеженою публічною інформацією для гри Battle',
      description:
        'Повертає список користувачів з обмеженою публічною інформацією. Використовується для відображення рейтингу та статистики.',
    }),

    ApiOkResponse({
      description: 'Список користувачів з публічною інформацією для рейтингу',
    }),

    ApiUnauthorizedResponse({
      description:
        'Користувач не авторизований (відсутній або недійсний accessToken)',
    }),
  );
};
