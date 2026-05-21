import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateGameSessionSuccessResponseDto } from '../dto/create-game-session/create-game-session-success-response.dto';
import { CreateGameSessionUnauthorizedResponseDto } from '../dto/create-game-session/create-game-session-unauthorized-response.dto';
import { CreateGameSessionNotFoundResponseDto } from '../dto/create-game-session/create-game-session-not-found-response.dto';

export const CreateGameSessionSwagger = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),

    ApiOperation({
      summary: 'Join game session',
      description:
        'Створює нову ігрову сесію для користувача та повертає provably fair дані.',
    }),

    ApiCreatedResponse({
      type: CreateGameSessionSuccessResponseDto,
      description: 'Успішне створення ігрової сесії.',
    }),

    ApiNotFoundResponse({
      type: CreateGameSessionNotFoundResponseDto,
      description:
        'Не вдалося створити ігрову сесію, оскільки відсутній clientSeed у користувача.',
    }),

    ApiUnauthorizedResponse({
      type: CreateGameSessionUnauthorizedResponseDto,
      description: 'Користувач не авторизований або токен недійсний.',
    }),
  );
};
