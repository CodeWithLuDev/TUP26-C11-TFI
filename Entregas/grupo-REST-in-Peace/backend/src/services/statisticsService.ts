import { EventType } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

type RankedPlayer = {
  position: number;
  player_id: number;
  player_name: string;
  player_number: number;
  team_id: number;
  team_name: string;
  team_code: string;
  flag_emoji: string;
  goals?: number;
  assists?: number;
};

async function buildRanking(userId: number, eventType: EventType, countKey: "goals" | "assists") {
  const events = await prisma.userGoalEvent.findMany({
    where: { userId, eventType },
    include: {
      player: {
        include: {
          team: { select: { id: true, name: true, code: true, flagEmoji: true } },
        },
      },
    },
  });

  const counts = new Map<
    number,
    { player: (typeof events)[0]["player"]; count: number }
  >();

  for (const event of events) {
    const existing = counts.get(event.playerId);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(event.playerId, { player: event.player, count: 1 });
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.player.name.localeCompare(b.player.name))
    .map((row, index): RankedPlayer => ({
      position: index + 1,
      player_id: row.player.id,
      player_name: row.player.name,
      player_number: row.player.number,
      team_id: row.player.team.id,
      team_name: row.player.team.name,
      team_code: row.player.team.code,
      flag_emoji: row.player.team.flagEmoji,
      [countKey]: row.count,
    }));
}

export async function getTopScorers(userId: number) {
  const scorers = await buildRanking(userId, EventType.goal, "goals");
  return { scorers };
}

export async function getTopAssisters(userId: number) {
  const assisters = await buildRanking(userId, EventType.assist, "assists");
  return { assisters };
}
