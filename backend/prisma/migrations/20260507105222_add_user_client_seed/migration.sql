-- CreateTable
CREATE TABLE "users"."user_seeds" (
    "user_id" TEXT NOT NULL,
    "client_seed" TEXT NOT NULL,

    CONSTRAINT "user_seeds_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "users"."user_seeds" ADD CONSTRAINT "user_seeds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
