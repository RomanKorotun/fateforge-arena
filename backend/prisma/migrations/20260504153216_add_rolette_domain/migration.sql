-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "roulette";

-- CreateTable
CREATE TABLE "roulette"."game_session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serverSeed" TEXT NOT NULL,
    "serverHash" TEXT NOT NULL,
    "clientSeed" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roulette"."roulette_bet" (
    "id" TEXT NOT NULL,
    "game_session_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bet_type" TEXT NOT NULL,
    "bet_value" INTEGER,
    "amount" INTEGER NOT NULL,
    "winning_number" INTEGER NOT NULL,
    "payout_amount" INTEGER NOT NULL,
    "is_win" BOOLEAN NOT NULL,
    "nonce" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roulette_bet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "roulette"."game_session" ADD CONSTRAINT "game_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roulette"."roulette_bet" ADD CONSTRAINT "roulette_bet_game_session_id_fkey" FOREIGN KEY ("game_session_id") REFERENCES "roulette"."game_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roulette"."roulette_bet" ADD CONSTRAINT "roulette_bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
