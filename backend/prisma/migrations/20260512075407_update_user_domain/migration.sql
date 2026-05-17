-- DropForeignKey
ALTER TABLE "users"."address" DROP CONSTRAINT "address_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users"."profile" DROP CONSTRAINT "profile_user_id_fkey";

-- AddForeignKey
ALTER TABLE "users"."profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
