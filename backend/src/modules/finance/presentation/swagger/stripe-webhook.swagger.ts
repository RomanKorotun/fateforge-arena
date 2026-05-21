import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';

export const StripeWebhookSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Stripe webhook endpoint',
      description: `
    Обробляє webhook події від Stripe.

    Підтримувані події:
    - checkout.session.completed
    - payment_intent.payment_failed

   ⚠️ Цей endpoint викликається тільки Stripe сервером.
      `,
    }),

    ApiHeader({
      name: 'stripe-signature',
      required: true,
      description: 'Підпис Stripe для валідації webhook',
    }),

    ApiResponse({
      status: 200,
      description: 'Webhook успішно прийнято',
      schema: { example: { received: true } },
    }),
  );
};
