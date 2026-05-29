-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "videoslot";

-- CreateTable
CREATE TABLE "videoslot"."VideoSlotHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "mode" INTEGER NOT NULL,
    "totalSpins" INTEGER NOT NULL,
    "totalBets" DECIMAL(15,2) NOT NULL,
    "totalWins" DECIMAL(15,2) NOT NULL,
    "rtp" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoSlotHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VideoSlotHistory_userId_idx" ON "videoslot"."VideoSlotHistory"("userId");

-- CreateIndex
CREATE INDEX "VideoSlotHistory_gameId_idx" ON "videoslot"."VideoSlotHistory"("gameId");

-- CreateIndex
CREATE INDEX "VideoSlotHistory_userId_gameId_idx" ON "videoslot"."VideoSlotHistory"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "videoslot"."VideoSlotHistory" ADD CONSTRAINT "VideoSlotHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
