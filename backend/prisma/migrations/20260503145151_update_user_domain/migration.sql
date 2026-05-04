/*
  Warnings:

  - You are about to drop the column `address2` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `is_banned` on the `user` table. All the data in the column will be lost.
  - Made the column `country` on table `address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users"."address" DROP COLUMN "address2",
ALTER COLUMN "country" SET NOT NULL;

-- AlterTable
ALTER TABLE "users"."user" DROP COLUMN "is_banned",
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;
