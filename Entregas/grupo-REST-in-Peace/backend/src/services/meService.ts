import { prisma } from "../lib/prisma";
import { getGroupQualifiers } from "./standingsService";
import { buildKnockoutResolutions, toTeamShapeNullable } from "./playoffsCore";

export async function getUserFixture(userId: number) {
  const [matches, groupResults] = await Promise.all([
    prisma.match.findMany({
      orderBy: { scheduledAtUtc: "asc" },
      include: {
        homeTeam: true,
        awayTeam: true,
        userResults: { where: { userId } },
        goalEvents: {
          where: { userId },
          include: { player: { select: { id: true, name: true } } },
        },
      },
    }),
    getGroupQualifiers(userId),
  ]);

  const knockoutResolved = buildKnockoutResolutions(
    matches.filter((m) => m.round !== "group"),
    groupResults
  );

  return matches.map((m) => {
    const userResult = m.userResults[0] ?? null;
    const knockout = knockoutResolved.get(m.id);

    const homeTeam = knockout ? knockout.homeTeam : toTeamShapeNullable(m.homeTeam);
    const awayTeam = knockout ? knockout.awayTeam : toTeamShapeNullable(m.awayTeam);

    return {
      id: m.id,
      round: m.round,
      group_letter: m.groupLetter,
      slot_key: m.slotKey,
      home_source: m.homeSource,
      away_source: m.awaySource,
      scheduled_at_utc: m.scheduledAtUtc,
      stadium: m.stadium,
      home_team: homeTeam,
      away_team: awayTeam,
      user_result: userResult
        ? {
            home_goals: userResult.homeGoals,
            away_goals: userResult.awayGoals,
            extra_time: userResult.extraTime,
            penalties: userResult.penalties,
            penalty_winner: userResult.penaltyWinner,
          }
        : null,
      goal_events: m.goalEvents.map((e) => ({
        id: e.id,
        player_id: e.playerId,
        player_name: e.player.name,
        event_type: e.eventType,
      })),
    };
  });
}
