import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const OAuthCallbackSwagger = (provider: string) => {
  return applyDecorators(
    ApiOperation({
      summary: `Callback після авторизації через ${provider}`,
      description: `Отримує дані користувача від ${provider}, створює або логінить користувача, встановлює JWT cookie та перенаправляє на frontend.`,
    }),

    ApiResponse({
      status: 302,
      description:
        'Перенаправлення на frontend після успішної авторизації (з JWT cookie).',
    }),
  );
};
