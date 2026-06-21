/*
  Warnings:

  - A unique constraint covering the columns `[team_id,number]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_team_id_number_key" ON "Player"("team_id", "number");
