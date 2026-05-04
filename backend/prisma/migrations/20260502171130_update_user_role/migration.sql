/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "users"."UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "users"."user" DROP COLUMN "role",
ADD COLUMN     "role" "users"."UserRole" NOT NULL DEFAULT 'USER';
