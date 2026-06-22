import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type TeamShape = { id: number; name: string; code: string; flag_emoji: string } | null;
type GroupResults = Map<string, { winner: TeamShape; runnerUp: TeamShape }>;
type SlotMap = Map<string, TeamShape>;

const ROUND_ORDER = ["R16", "QF", "SF", "3rd", "final"];

function toTeamShape(
  team: { id: number; name: string; code: string; flagEmoji: string } | null
): TeamShape {
  if (!team) return null;
  return { id: team.id, name: team.name, code: team.code, flag_emoji: team.flagEmoji };
}

function computeGroupStandings(
  groupMatches: Array<{
    groupLetter: string | null;
    homeTeam: { id: number; name: string; code: string; flagEmoji: string } | null;
    awayTeam: { id: number; name: string; code: string; flagEmoji: string } | null;
    userResults: Array<{ homeGoals: number; awayGoals: number }>;
  }>
): GroupResults {
  const byGroup = new Map<string, typeof groupMatches>();

  for (const match of groupMatches) {
    if (!match.groupLetter) continue;
    if (!byGroup.has(match.groupLetter)) byGroup.set(match.groupLetter, []);
    byGroup.get(match.groupLetter)!.push(match);
  }

  const result: GroupResults = new Map();

  for (const [letter, matches] of byGroup) {
    if (!matches.every((m) => m.userResults.length > 0)) {
      result.set(letter, { winner: null, runnerUp: null });
      continue;
    }

    const stats = new Map<
      number,
      {
        team: { id: number; name: string; code: string; flagEmoji: string };
        pts: number;
        gd: number;
        gf: number;
      }
    >();

    for (const match of matches) {
      const r = match.userResults[0]!;
      const home = match.homeTeam!;
      const away = match.awayTeam!;

      if (!stats.has(home.id)) stats.set(home.id, { team: home, pts: 0, gd: 0, gf: 0 });
      if (!stats.has(away.id)) stats.set(away.id, { team: away, pts: 0, gd: 0, gf: 0 });

      const hs = stats.get(home.id)!;
      const as_ = stats.get(away.id)!;

      hs.gf += r.homeGoals;
      hs.gd += r.homeGoals - r.awayGoals;
      as_.gf += r.awayGoals;
      as_.gd += r.awayGoals - r.homeGoals;

      if (r.homeGoals > r.awayGoals) {
        hs.pts += 3;
      } else if (r.awayGoals > r.homeGoals) {
        as_.pts += 3;
      } else {
        hs.pts += 1;
        as_.pts += 1;
      }
    }

    const sorted = [...stats.values()].sort(
      (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf
    );

    result.set(letter, {
      winner: sorted[0] ? toTeamShape(sorted[0].team) : null,
      runnerUp: sorted[1] ? toTeamShape(sorted[1].team) : null,
    });
  }

  return result;
}

function resolveSource(
  source: string | null,
  groupResults: GroupResults,
  knockoutWinners: SlotMap,
  knockoutLosers: SlotMap
): TeamShape {
  if (!source) return null;

  const groupWinner = source.match(/^Winner Group ([A-H])$/);
  if (groupWinner) return groupResults.get(groupWinner[1])?.winner ?? null;

  const groupRunnerUp = source.match(/^Runner-up Group ([A-H])$/);
  if (groupRunnerUp) return groupResults.get(groupRunnerUp[1])?.runnerUp ?? null;

  const knockoutWinner = source.match(/^Winner (.+)$/);
  if (knockoutWinner) return knockoutWinners.get(knockoutWinner[1]) ?? null;

  const knockoutLoser = source.match(/^Loser (.+)$/);
  if (knockoutLoser) return knockoutLosers.get(knockoutLoser[1]) ?? null;

  return null;
}

export async function getUserFixture(userId: number) {
  const matches = await prisma.match.findMany({
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
  });

  const groupResults = computeGroupStandings(matches.filter((m) => m.round === "group"));

  const knockoutWinners: SlotMap = new Map();
  const knockoutLosers: SlotMap = new Map();
  const knockoutResolvedTeams = new Map<number, { homeTeam: TeamShape; awayTeam: TeamShape }>();

  // Process knockout rounds in order so winners feed into later rounds
  const knockoutByRound = matches
    .filter((m) => m.round !== "group")
    .sort((a, b) => ROUND_ORDER.indexOf(a.round) - ROUND_ORDER.indexOf(b.round));

  for (const match of knockoutByRound) {
    const homeTeam =
      match.homeTeam !== null
        ? toTeamShape(match.homeTeam)
        : resolveSource(match.homeSource, groupResults, knockoutWinners, knockoutLosers);
    const awayTeam =
      match.awayTeam !== null
        ? toTeamShape(match.awayTeam)
        : resolveSource(match.awaySource, groupResults, knockoutWinners, knockoutLosers);

    knockoutResolvedTeams.set(match.id, { homeTeam, awayTeam });

    const result = match.userResults[0];
    if (result && homeTeam && awayTeam && match.slotKey) {
      let winner: TeamShape = null;
      let loser: TeamShape = null;

      if (result.homeGoals > result.awayGoals) {
        winner = homeTeam;
        loser = awayTeam;
      } else if (result.awayGoals > result.homeGoals) {
        winner = awayTeam;
        loser = homeTeam;
      } else if (result.penaltyWinner) {
        const winnerIsHome = result.penaltyWinner === homeTeam.code;
        winner = winnerIsHome ? homeTeam : awayTeam;
        loser = winnerIsHome ? awayTeam : homeTeam;
      }

      if (winner) knockoutWinners.set(match.slotKey, winner);
      if (loser) knockoutLosers.set(match.slotKey, loser);
    }
  }

  return matches.map((m) => {
    const userResult = m.userResults[0] ?? null;
    const knockoutResolved = knockoutResolvedTeams.get(m.id);

    const homeTeam = knockoutResolved ? knockoutResolved.homeTeam : toTeamShape(m.homeTeam);
    const awayTeam = knockoutResolved ? knockoutResolved.awayTeam : toTeamShape(m.awayTeam);

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
