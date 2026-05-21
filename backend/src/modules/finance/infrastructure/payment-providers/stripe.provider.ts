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
    const key = this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');

    console.log('🔑 STRIPE KEY LOADED:', !!key);

    this.stripe = new Stripe(key, {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  async createCheckoutSession(data: CreateCheckoutData) {
    try {
      console.log('➡️ STRIPE CHECKOUT INPUT:', data);

      const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');

      console.log('🌍 FRONTEND_URL:', frontendUrl);

      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',

        metadata: {
          orderId: data.orderId,
        },

        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: data.currency,
              unit_amount: Math.round(data.amount * 100),
              product_data: {
                name: data.description,
              },
            },
          },
        ],

        payment_intent_data: {
          description: data.description,
        },

        success_url: `${frontendUrl}/payment-success`,
        cancel_url: `${frontendUrl}/payment-failed`,
      });

      console.log('✅ STRIPE SESSION CREATED:', session.id);

      return {
        checkoutUrl: session.url!,
      };
    } catch (err) {
      console.error('❌ STRIPE CHECKOUT ERROR:', err);
      throw err;
    }
  }

  verifyWebhookSignature(payload: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
    );
  }
}
