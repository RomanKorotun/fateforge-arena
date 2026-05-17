/*
  Warnings:

  - Changed the type of `bet_type` on the `roulette_bet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "roulette"."BetType" AS ENUM ('RED', 'BLACK', 'EVEN', 'ODD', 'STRAIGHT');

-- AlterTable
ALTER TABLE "roulette"."roulette_bet" DROP COLUMN "bet_type",
ADD COLUMN     "bet_type" "roulette"."BetType" NOT NULL;
