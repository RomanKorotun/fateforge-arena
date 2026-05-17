/*
  Warnings:

  - You are about to drop the column `is_email_confirmed` on the `user_email_verifications` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user_email_verifications` table. All the data in the column will be lost.
  - You are about to drop the column `verification_code` on the `user_email_verifications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `user_email_verifications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `user_email_verifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users"."user_email_verifications_user_id_key";

-- AlterTable
ALTER TABLE "users"."user" ADD COLUMN     "email_verified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users"."user_email_verifications" DROP COLUMN "is_email_confirmed",
DROP COLUMN "updated_at",
DROP COLUMN "verification_code",
ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "used_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_verifications_token_key" ON "users"."user_email_verifications"("token");

-- CreateIndex
CREATE INDEX "user_email_verifications_user_id_idx" ON "users"."user_email_verifications"("user_id");

-- CreateIndex
CREATE INDEX "user_email_verifications_token_idx" ON "users"."user_email_verifications"("token");
