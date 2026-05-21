/*
  Warnings:

  - Added the required column `balanceBefore` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "finance"."transactions" ADD COLUMN     "balanceAfter" DECIMAL(15,2),
ADD COLUMN     "balanceBefore" DECIMAL(15,2) NOT NULL;
