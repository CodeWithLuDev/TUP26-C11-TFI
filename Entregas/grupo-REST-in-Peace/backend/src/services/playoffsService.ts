import { prisma } from "../lib/prisma";
import { getGroupQualifiers, TeamShape } from "./standingsService";
import { buildKnockoutResolutions, resolveMatchOutcome, ROUND_ORDER } from "./playoffsCore";

export { ROUND_ORDER };

export const ROUND_LABELS: Record<(typeof ROUND_ORDER)[number], string> = {
  R16: "Octavos de final",
  QF: "Cuartos de final",
  SF: "Semifinales",
  "3rd": "Tercer puesto",
  final: "Final",
};

export async function getBracket(userId: number) {
  const [groupResults, matches] = await Promise.all([
    getGroupQualifiers(userId),
    prisma.match.findMany({
      where: { round: { not: "group" } },
      include: {
        homeTeam: true,
        awayTeam: true,
        userResults: { where: { userId } },
      },
    }),
  ]);

  const resolutions = buildKnockoutResolutions(matches, groupResults);

  const allMatches = matches.map((match) => {
    const { homeTeam, awayTeam } = resolutions.get(match.id) ?? {
      homeTeam: null,
      awayTeam: null,
    };
    const userResult = match.userResults[0] ?? null;

    let winner: TeamShape | null = null;
    if (userResult && homeTeam && awayTeam) {
      const outcome = resolveMatchOutcome(homeTeam, awayTeam, userResult);
      winner = outcome?.winner ?? null;
    }

    return {
      match_id: match.id,
      slot_key: match.slotKey,
      round: match.round,
      round_label: ROUND_LABELS[match.round as (typeof ROUND_ORDER)[number]] ?? match.round,
      home_source: match.homeSource,
      away_source: match.awaySource,
      scheduled_at_utc: match.scheduledAtUtc,
      stadium: match.stadium,
      home_team: homeTeam,
      away_team: awayTeam,
      is_ready: homeTeam !== null && awayTeam !== null,
      user_result: userResult
        ? {
            home_goals: userResult.homeGoals,
            away_goals: userResult.awayGoals,
            extra_time: userResult.extraTime,
            penalties: userResult.penalties,
            penalty_winner: userResult.penaltyWinner,
          }
        : null,
      winner,
    };
  });

  const sorted = [...allMatches].sort(
    (a, b) =>
      ROUND_ORDER.indexOf(a.round as (typeof ROUND_ORDER)[number]) -
      ROUND_ORDER.indexOf(b.round as (typeof ROUND_ORDER)[number])
  );

  const rounds = {} as Record<(typeof ROUND_ORDER)[number], typeof allMatches>;
  for (const round of ROUND_ORDER) {
    rounds[round] = sorted.filter((m) => m.round === round);
  }

  const groupsComplete = [...groupResults.values()].every((g) => g.winner && g.runnerUp);

  return {
    groups_complete: groupsComplete,
    rounds,
  };
}
