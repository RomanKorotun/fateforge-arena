import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositSuccessResponseDto {
  @ApiProperty({
    description: 'URL для оплати через Stripe Checkout',
    example: 'https://checkout.stripe.com/pay/cs_test_123',
  })
  checkoutUrl!: string;
}
