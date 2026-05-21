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

import { StripeWebhookSwagger } from '../swagger/stripe-webhook.swagger';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripeProvider: StripeProvider,
    private readonly handleDepositWebhookUseCase: HandleDepositWebhookUseCase,
  ) {}

  @StripeWebhookSwagger()
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

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        const orderId = session?.metadata?.orderId;

        if (!orderId) return { received: true };

        await this.handleDepositWebhookUseCase.execute({
          provider: PaymentProvider.STRIPE,
          orderId,
          status: TransactionStatus.COMPLETED,
          amount: session.amount_total,
          transactionId: String(session.payment_intent ?? ''),
        });

        break;
      }

      case 'payment_intent.payment_failed': {
        const session = event.data.object;

        const orderId = session?.metadata?.orderId;

        if (!orderId) return { received: true };

        if (orderId) {
          await this.handleDepositWebhookUseCase.execute({
            provider: PaymentProvider.STRIPE,
            orderId,
            status: TransactionStatus.FAILED,
            amount: 0,
            transactionId: String(session.payment_intent ?? ''),
          });
        }

        break;
      }

      default:
        break;
    }

    return { received: true };
  }
}
