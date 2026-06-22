/*
  Warnings:

  - A unique constraint covering the columns `[home_team_id,away_team_id]` on the table `Match` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Match_home_team_id_away_team_id_key" ON "Match"("home_team_id", "away_team_id");
