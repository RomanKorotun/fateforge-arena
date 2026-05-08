-- CreateTable
CREATE TABLE "users"."user_email_verifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "verification_code" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_verifications_user_id_key" ON "users"."user_email_verifications"("user_id");

-- AddForeignKey
ALTER TABLE "users"."user_email_verifications" ADD CONSTRAINT "user_email_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
