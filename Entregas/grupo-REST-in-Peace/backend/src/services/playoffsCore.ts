import { GroupQualifiers, TeamShape } from "./standingsService";

export const ROUND_ORDER = ["R16", "QF", "SF", "3rd", "final"] as const;

type SlotMap = Map<string, TeamShape>;

type DbTeam = { id: number; name: string; code: string; flagEmoji: string };

type UserResultRow = {
  homeGoals: number;
  awayGoals: number;
  extraTime: number;
  penalties: number;
  penaltyWinner: string | null;
};

export type KnockoutMatchInput = {
  id: number;
  round: string;
  slotKey: string | null;
  homeSource: string | null;
  awaySource: string | null;
  homeTeam: DbTeam | null;
  awayTeam: DbTeam | null;
  userResults: UserResultRow[];
};

export function toTeamShape(team: DbTeam): TeamShape {
  return { id: team.id, name: team.name, code: team.code, flag_emoji: team.flagEmoji };
}

export function toTeamShapeNullable(team: DbTeam | null): TeamShape | null {
  if (!team) return null;
  return toTeamShape(team);
}

function resolveSource(
  source: string | null,
  groupResults: GroupQualifiers,
  knockoutWinners: SlotMap,
  knockoutLosers: SlotMap
): TeamShape | null {
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

export function resolveMatchOutcome(
  homeTeam: TeamShape,
  awayTeam: TeamShape,
  result: UserResultRow
): { winner: TeamShape; loser: TeamShape } | null {
  if (result.homeGoals > result.awayGoals) {
    return { winner: homeTeam, loser: awayTeam };
  }
  if (result.awayGoals > result.homeGoals) {
    return { winner: awayTeam, loser: homeTeam };
  }
  if (result.penaltyWinner) {
    const winnerIsHome = result.penaltyWinner === homeTeam.code;
    return {
      winner: winnerIsHome ? homeTeam : awayTeam,
      loser: winnerIsHome ? awayTeam : homeTeam,
    };
  }
  return null;
}

export function buildKnockoutResolutions(
  knockoutMatches: KnockoutMatchInput[],
  groupResults: GroupQualifiers
): Map<number, { homeTeam: TeamShape | null; awayTeam: TeamShape | null }> {
  const knockoutWinners: SlotMap = new Map();
  const knockoutLosers: SlotMap = new Map();
  const resolved = new Map<number, { homeTeam: TeamShape | null; awayTeam: TeamShape | null }>();

  const sorted = [...knockoutMatches].sort(
    (a, b) =>
      ROUND_ORDER.indexOf(a.round as (typeof ROUND_ORDER)[number]) -
      ROUND_ORDER.indexOf(b.round as (typeof ROUND_ORDER)[number])
  );

  for (const match of sorted) {
    const homeTeam = match.homeTeam
      ? toTeamShape(match.homeTeam)
      : resolveSource(match.homeSource, groupResults, knockoutWinners, knockoutLosers);
    const awayTeam = match.awayTeam
      ? toTeamShape(match.awayTeam)
      : resolveSource(match.awaySource, groupResults, knockoutWinners, knockoutLosers);

    resolved.set(match.id, { homeTeam, awayTeam });

    const result = match.userResults[0];
    if (result && homeTeam && awayTeam && match.slotKey) {
      const outcome = resolveMatchOutcome(homeTeam, awayTeam, result);
      if (outcome) {
        knockoutWinners.set(match.slotKey, outcome.winner);
        knockoutLosers.set(match.slotKey, outcome.loser);
      }
    }
  }

  return resolved;
}
