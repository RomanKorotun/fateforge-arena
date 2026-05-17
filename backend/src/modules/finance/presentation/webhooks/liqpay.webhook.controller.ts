import { Body, Controller, Post, BadRequestException } from '@nestjs/common';

import { LiqPayProvider } from '../../infrastructure/payment-providers/liqpay.provider';
import { HandleDepositWebhookUseCase } from '../../application/handle-deposit-webhook/handle-deposit-webhook.use-case';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

@Controller('webhooks/liqpay')
export class LiqPayWebhookController {
  constructor(
    private readonly liqpayProvider: LiqPayProvider,
    private readonly handlePaymentWebhookUseCase: HandleDepositWebhookUseCase,
  ) {}

  @Post()
  async handleWebhook(
    @Body('data') data: string,
    @Body('signature') signature: string,
  ) {
    const isValid = this.liqpayProvider.verifySignature(data, signature);

    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }

    const payload = this.liqpayProvider.decodeData<{
      order_id: string;
      status: string;
      amount: number;
      transaction_id: string;
    }>(data);

    return this.handlePaymentWebhookUseCase.execute({
      provider: PaymentProvider.LIQPAY,
      orderId: payload.order_id,
      status: payload.status,
      amount: payload.amount,
      transactionId: payload.transaction_id,
    });
  }
}
