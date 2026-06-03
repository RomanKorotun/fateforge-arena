-- AddForeignKey
ALTER TABLE "videoslot"."VideoSlotHistory" ADD CONSTRAINT "VideoSlotHistory_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "finance"."wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
