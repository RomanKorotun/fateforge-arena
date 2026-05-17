/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_email_verifications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_email_verifications_user_id_key" ON "users"."user_email_verifications"("user_id");
