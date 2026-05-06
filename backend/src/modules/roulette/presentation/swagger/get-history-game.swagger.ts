import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GetHistoryGameSuccessResponseDto } from '../dto/get-history-game/get-history-game-success-response.dto';
import { GetHistoryGameUnauthorizedResponseDto } from '../dto/get-history-game/gey-history-game-unauthorized-response.dto';

export const GetHistoryGameSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Get game history',
      description:
        'Повертає історію ставок користувача з можливістю пагінації або по конкретній ігровій сесії або по всіх своїх ігрових сесіях.',
    }),

    ApiOkResponse({
      type: GetHistoryGameSuccessResponseDto,
      isArray: true,
      description: 'Успішне отримання історії ставок користувача.',
    }),

    ApiUnauthorizedResponse({
      type: GetHistoryGameUnauthorizedResponseDto,
      description: 'Користувач не авторизований або токен недійсний.',
    }),
  );
};
