import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { HandleDepositWebhookUseCase } from '../../application/handle-deposit-webhook/handle-deposit-webhook.use-case';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';
import { WayforpayProvider } from '../../infrastructure/payment-providers/way-for-pay.provider';

@Controller('webhooks/wayforpay')
export class WayForPayWebhookController {
  constructor(
    private readonly wayforpayProvider: WayforpayProvider,
    private readonly handlePaymentWebhookUseCase: HandleDepositWebhookUseCase,
  ) {}

  @Post()
  async handleWebhook(@Req() req: Request) {
    console.log('RAW BODY:', req.body);

    const rawKey = Object.keys(req.body)[0];

    if (!rawKey) {
      throw new BadRequestException('Empty webhook body');
    }

    const body = JSON.parse(rawKey);

    console.log('PARSED BODY:', body);

    // const merchantSignature = body.merchantSignature;

    // const isValid = this.wayforpayProvider.verifySignature(
    //   body,
    //   merchantSignature,
    // );

    // if (!isValid) {
    //   throw new BadRequestException('Invalid signature');
    // }

    // await this.handlePaymentWebhookUseCase.execute({
    //   provider: PaymentProvider.WAYFORPAY,
    //   orderId: body.orderReference,
    //   status: body.transactionStatus,
    //   amount: Number(body.amount),
    //   transactionId: body.transactionId,
    // });

    // const time = Math.floor(Date.now() / 1000);

    // return {
    //   orderReference: body.orderReference,
    //   status: 'accept',
    //   time,
    //   signature: this.wayforpayProvider.createResponseSignature(
    //     body.orderReference,
    //     time,
    //   ),
    // };
  }
}
