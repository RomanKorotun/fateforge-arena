-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateTable
CREATE TABLE "users"."user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "role" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ban_end_at" TIMESTAMP(3),
    "last_login_ip" TEXT,
    "last_login_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"."profile" (
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "balance" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "users"."address" (
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "address2" TEXT,
    "country" TEXT,

    CONSTRAINT "address_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "users"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "users"."user"("email");

-- CreateIndex
CREATE INDEX "user_username_idx" ON "users"."user"("username");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "users"."user"("email");

-- CreateIndex
CREATE INDEX "user_created_at_idx" ON "users"."user"("created_at");

-- CreateIndex
CREATE INDEX "user_last_login_ip_idx" ON "users"."user"("last_login_ip");

-- CreateIndex
CREATE INDEX "profile_rating_idx" ON "users"."profile"("rating");

-- CreateIndex
CREATE INDEX "profile_level_idx" ON "users"."profile"("level");

-- CreateIndex
CREATE INDEX "address_country_idx" ON "users"."address"("country");

-- CreateIndex
CREATE INDEX "address_city_idx" ON "users"."address"("city");

-- AddForeignKey
ALTER TABLE "users"."profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
