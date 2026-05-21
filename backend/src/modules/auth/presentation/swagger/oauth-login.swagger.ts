import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const OAuthLoginSwagger = (provider: string) => {
  return applyDecorators(
    ApiOperation({
      summary: `Авторизація через ${provider}`,
      description: `Перенаправляє користувача на сторінку авторизації ${provider}. Після успішного входу користувач повертається на callback endpoint.`,
    }),

    ApiResponse({
      status: 302,
      description: `Тимчасове перенаправлення на сторінку авторизації ${provider} (OAuth redirect).`,
    }),
  );
};
