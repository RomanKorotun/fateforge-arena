/*
  Warnings:

  - The `currency` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "finance"."transactions" DROP COLUMN "currency",
ADD COLUMN     "currency" "finance"."Currency" NOT NULL DEFAULT 'UAH';
