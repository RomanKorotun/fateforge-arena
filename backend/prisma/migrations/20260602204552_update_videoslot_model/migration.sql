/*
  Warnings:

  - Added the required column `walletId` to the `VideoSlotHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "videoslot"."VideoSlotHistory" ADD COLUMN     "walletId" TEXT NOT NULL;
