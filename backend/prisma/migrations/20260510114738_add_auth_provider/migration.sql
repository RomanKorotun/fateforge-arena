-- CreateEnum
CREATE TYPE "users"."AuthProviderType" AS ENUM ('DISCORD', 'LINKEDIN', 'FACEBOOK', 'GOOGLE');

-- AlterTable
ALTER TABLE "users"."user" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "users"."user_auth_providers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "users"."AuthProviderType" NOT NULL,
    "provider_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_auth_providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_auth_providers_user_id_idx" ON "users"."user_auth_providers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_providers_provider_provider_id_key" ON "users"."user_auth_providers"("provider", "provider_id");

-- AddForeignKey
ALTER TABLE "users"."user_auth_providers" ADD CONSTRAINT "user_auth_providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
