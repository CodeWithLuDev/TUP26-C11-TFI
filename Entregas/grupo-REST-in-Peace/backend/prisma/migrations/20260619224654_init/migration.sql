-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('goal', 'assist');

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "flag_emoji" TEXT NOT NULL,
    "group_letter" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "round" TEXT NOT NULL,
    "home_team_id" INTEGER,
    "away_team_id" INTEGER,
    "group_letter" TEXT,
    "slot_key" TEXT,
    "home_source" TEXT,
    "away_source" TEXT,
    "scheduled_at_utc" TIMESTAMP(3) NOT NULL,
    "stadium" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserResult" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "match_id" INTEGER NOT NULL,
    "home_goals" INTEGER NOT NULL,
    "away_goals" INTEGER NOT NULL,
    "extra_time" INTEGER NOT NULL DEFAULT 0,
    "penalties" INTEGER NOT NULL DEFAULT 0,
    "penalty_winner" TEXT,
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGoalEvent" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "match_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "event_type" "EventType" NOT NULL,

    CONSTRAINT "UserGoalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserResult_user_id_match_id_key" ON "UserResult"("user_id", "match_id");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResult" ADD CONSTRAINT "UserResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResult" ADD CONSTRAINT "UserResult_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGoalEvent" ADD CONSTRAINT "UserGoalEvent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGoalEvent" ADD CONSTRAINT "UserGoalEvent_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGoalEvent" ADD CONSTRAINT "UserGoalEvent_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
