/*
  Warnings:

  - A unique constraint covering the columns `[slot_key]` on the table `Match` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Match_slot_key_key" ON "Match"("slot_key");
