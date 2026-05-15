import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

interface GenerateDepositCheckoutData {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
}

@Injectable()
export class LiqPayProvider {
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly BACKEND_URL: string;

  constructor(private readonly configService: ConfigService) {
    this.publicKey = this.configService.getOrThrow<string>('PUBLIC_KEY_LIQPAY');
    this.privateKey =
      this.configService.getOrThrow<string>('PRIVATE_KEY_LIQPAY');
    this.BACKEND_URL = this.configService.getOrThrow('BACKEND_URL');
  }

  // Створення checkout payload для поповнення
  generateDepositCheckout({
    amount,
    currency,
    description,
    orderId,
  }: GenerateDepositCheckoutData) {
    const payload = {
      version: 3,
      public_key: this.publicKey,
      action: 'pay',
      amount: Number(Number(amount).toFixed(2)),
      currency,
      description,
      order_id: orderId,
      result_url: 'https://fateforge-arena-frontend.netlify.app/privacy-policy',
      server_url: `${this.BACKEND_URL}/webhooks/liqpay`,
    };

    const data = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = this.createSignature(data);

    return { data, signature };
  }

  // Запит на вивід коштів
  createWithdrawRequest() {}

  // Перевірка підпису webhook
  verifySignature(data: string, signature: string): boolean {
    const calculatedSignature = this.createSignature(data);
    return calculatedSignature === signature;
  }

  // Декодування base64 payload
  decodeData<T>(data: string): T {
    const decoded = Buffer.from(data, 'base64').toString('utf-8');
    return JSON.parse(decoded) as T;
  }

  // Генерація sha1 signature
  private createSignature(encodedData: string): string {
    const signString = this.privateKey + encodedData + this.privateKey;
    return crypto.createHash('sha1').update(signString).digest('base64');
  }
}
