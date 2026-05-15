-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "finance";

-- CreateEnum
CREATE TYPE "finance"."TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'REFUND', 'BET', 'WIN');

-- CreateEnum
CREATE TYPE "finance"."TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "finance"."PaymentProvider" AS ENUM ('LIQPAY');

-- CreateEnum
CREATE TYPE "finance"."Currency" AS ENUM ('UAH', 'USD', 'EUR');

-- CreateTable
CREATE TABLE "finance"."wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "currency" "finance"."Currency" NOT NULL DEFAULT 'UAH',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."transactions" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "finance"."TransactionType" NOT NULL,
    "status" "finance"."TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UAH',
    "provider" "finance"."PaymentProvider",
    "orderId" TEXT,
    "providerPaymentId" TEXT,
    "idempotencyKey" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_key" ON "finance"."wallets"("userId");

-- CreateIndex
CREATE INDEX "wallets_userId_idx" ON "finance"."wallets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_orderId_key" ON "finance"."transactions"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_idempotencyKey_key" ON "finance"."transactions"("idempotencyKey");

-- CreateIndex
CREATE INDEX "transactions_walletId_idx" ON "finance"."transactions"("walletId");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "finance"."transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "finance"."transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "finance"."transactions"("createdAt");

-- AddForeignKey
ALTER TABLE "finance"."wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance"."transactions" ADD CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "finance"."wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
