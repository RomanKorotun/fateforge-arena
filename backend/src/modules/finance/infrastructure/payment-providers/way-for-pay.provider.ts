import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

type GenerateCheckoutInput = {
  amount: number;
  currency: string;
  orderId: string;
  description?: string;
};

@Injectable()
export class WayforpayProvider {
  private readonly merchantAccount: string;
  private readonly merchantSecret: string;

  constructor(private readonly config: ConfigService) {
    this.merchantAccount = this.config.getOrThrow<string>(
      'WFP_MERCHANT_ACCOUNT',
    );

    this.merchantSecret = this.config.getOrThrow<string>('WFP_MERCHANT_SECRET');
  }

  generateDepositCheckout({
    amount,
    currency,
    orderId,
    description,
  }: GenerateCheckoutInput) {
    const orderDate = Math.floor(Date.now() / 1000);

    const formattedAmount = Number(amount).toFixed(2);

    const payload = {
      merchantAccount: this.merchantAccount,
      orderReference: orderId,
      orderDate,
      amount: formattedAmount,
      currency,
      productName: [description ?? 'Deposit'],
      productCount: [1],
      productPrice: [formattedAmount],
      returnUrl: 'http://localhost:5173',
      serviceUrl:
        'https://1879-91-214-85-80.ngrok-free.app/api/webhooks/wayforpay',
    };

    const merchantSignature = this.createSignature(payload);

    return {
      actionUrl: 'https://secure.wayforpay.com/pay',
      method: 'POST',
      fields: {
        ...payload,
        merchantSignature,
      },
    };
  }

  private createSignature(payload: any): string {
    const stringToSign = [
      payload.merchantAccount,
      payload.merchantDomainName,
      payload.orderReference,
      payload.orderDate,
      payload.amount,
      payload.currency,
      ...payload.productName,
      ...payload.productCount,
      ...payload.productPrice,
    ].join(';');

    return crypto
      .createHmac('md5', this.merchantSecret)
      .update(stringToSign)
      .digest('hex');
  }

  verifySignature(payload: any, signature: string): boolean {
    const stringToSign = [
      payload.merchantAccount,
      payload.orderReference,
      payload.amount,
      payload.currency,
      payload.authCode,
      payload.cardPan,
      payload.transactionStatus,
      payload.reasonCode,
    ].join(';');

    const expected = crypto
      .createHmac('md5', this.merchantSecret)
      .update(stringToSign)
      .digest('hex');

    return expected === signature;
  }

  createResponseSignature(orderReference: string, time: number): string {
    return crypto
      .createHmac('md5', this.merchantSecret)
      .update([orderReference, 'accept', time].join(';'))
      .digest('hex');
  }
}
