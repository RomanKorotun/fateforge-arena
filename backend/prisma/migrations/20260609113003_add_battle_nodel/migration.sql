-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "battle";

-- DropIndex
DROP INDEX "users"."user_username_key";

-- CreateTable
CREATE TABLE "battle"."battle_results" (
    "id" TEXT NOT NULL,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "totalRounds" INTEGER NOT NULL,
    "player1Health" INTEGER NOT NULL,
    "player2Health" INTEGER NOT NULL,
    "player1MovesHistory" JSONB NOT NULL,
    "player2MovesHistory" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "battle_results_pkey" PRIMARY KEY ("id")
);
