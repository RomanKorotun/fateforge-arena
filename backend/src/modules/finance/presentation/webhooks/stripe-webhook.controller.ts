import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { StripeProvider } from '../../infrastructure/payment-providers/stripe.provider';
import { HandleDepositWebhookUseCase } from '../../application/handle-deposit-webhook/handle-deposit-webhook.use-case';

import { PaymentProvider } from '../../domain/enums/payment-provider.enum';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripeProvider: StripeProvider,
    private readonly handleDepositWebhookUseCase: HandleDepositWebhookUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    const payload = req.body as Buffer;

    const event: any = this.stripeProvider.verifyWebhookSignature(
      payload,
      signature,
    );

    const session = event.data.object;

    const orderId = session?.metadata?.orderId;

    if (!orderId) {
      return { received: true };
    }

    if (event.type === 'checkout.session.completed') {
      await this.handleDepositWebhookUseCase.execute({
        provider: PaymentProvider.STRIPE,
        orderId,
        status: TransactionStatus.COMPLETED,
        amount: session.amount_total,
        transactionId: String(session.payment_intent ?? ''),
      });
    }

    if (event.type === 'payment_intent.payment_failed') {
      await this.handleDepositWebhookUseCase.execute({
        provider: PaymentProvider.STRIPE,
        orderId,
        status: TransactionStatus.FAILED,
        amount: 0,
        transactionId: String(session.payment_intent ?? ''),
      });
    }

    return { received: true };
  }
}
