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
    try {
      console.log('\n================ STRIPE WEBHOOK START ================');
      console.log('📩 Signature:', signature);

      const payload = req.body as Buffer;

      console.log('📦 RAW PAYLOAD SIZE:', payload?.length);

      const event: any = this.stripeProvider.verifyWebhookSignature(
        payload,
        signature,
      );

      console.log('🎯 EVENT TYPE:', event.type);
      console.log('🆔 EVENT ID:', event.id);

      const session = event.data.object;
      console.log('📄 SESSION:', JSON.stringify(session, null, 2));

      const orderId = session?.metadata?.orderId;

      console.log('🧾 ORDER ID:', orderId);

      if (!orderId) {
        console.log('❌ NO ORDER ID → EXIT');
        return { received: true };
      }

      if (event.type === 'checkout.session.completed') {
        console.log('➡️ PROCESS: checkout.session.completed');

        await this.handleDepositWebhookUseCase.execute({
          provider: PaymentProvider.STRIPE,
          orderId,
          status: TransactionStatus.COMPLETED,
          amount: session.amount_total,
          transactionId: String(session.payment_intent ?? ''),
        });

        console.log('✅ SUCCESS WEBHOOK PROCESSED');
      }

      if (event.type === 'payment_intent.payment_failed') {
        console.log('➡️ PROCESS: payment_intent.payment_failed');

        await this.handleDepositWebhookUseCase.execute({
          provider: PaymentProvider.STRIPE,
          orderId,
          status: TransactionStatus.FAILED,
          amount: 0,
          transactionId: String(session.payment_intent ?? ''),
        });

        console.log('❌ FAILED WEBHOOK PROCESSED');
      }

      console.log('================ STRIPE WEBHOOK END ================\n');

      return { received: true };
    } catch (err) {
      console.error('🔥 WEBHOOK CRASH:', err);
      throw err;
    }
  }
}
