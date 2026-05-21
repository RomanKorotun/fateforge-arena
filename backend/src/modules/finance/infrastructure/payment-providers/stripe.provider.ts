import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

interface CreateCheckoutData {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
}

@Injectable()
export class StripeProvider {
  private readonly stripe: InstanceType<typeof Stripe>;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      { apiVersion: '2026-04-22.dahlia' },
    );
  }

  async createCheckoutSession({
    amount,
    currency,
    orderId,
    description,
  }: CreateCheckoutData) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      metadata: {
        orderId,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: description,
            },
          },
        },
      ],
      payment_intent_data: {
        description,
      },

      success_url: `${this.configService.getOrThrow(
        'FRONTEND_URL',
      )}/payment-success`,

      cancel_url: `${this.configService.getOrThrow(
        'FRONTEND_URL',
      )}/payment-failed`,
    });

    return {
      checkoutUrl: session.url!,
    };
  }

  verifyWebhookSignature(payload: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
    );
  }
}
