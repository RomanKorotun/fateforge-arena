/*
  Warnings:

  - You are about to drop the column `walletId` on the `VideoSlotHistory` table. All the data in the column will be lost.
  - Added the required column `currency` to the `VideoSlotHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "videoslot"."VideoSlotHistory" DROP CONSTRAINT "VideoSlotHistory_walletId_fkey";

-- AlterTable
ALTER TABLE "videoslot"."VideoSlotHistory" DROP COLUMN "walletId",
ADD COLUMN     "currency" TEXT NOT NULL;
