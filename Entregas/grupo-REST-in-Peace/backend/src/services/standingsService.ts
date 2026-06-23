import { prisma } from "../lib/prisma";
import {
  PlayedGroupMatch,
  sortStandings,
  StandingEntry,
} from "./tiebreakers";

const GROUP_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export type TeamShape = {
  id: number;
  name: string;
  code: string;
  flag_emoji: string;
};

export type GroupQualifiers = Map<
  string,
  { winner: TeamShape | null; runnerUp: TeamShape | null }
>;

type TeamInfo = {
  id: number;
  name: string;
  code: string;
  flagEmoji: string;
  groupLetter: string;
};

function createEmptyStanding(team: TeamInfo): StandingEntry {
  return {
    teamId: team.id,
    groupLetter: team.groupLetter,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

function toPlayedMatches(
  matches: Array<{
    groupLetter: string | null;
    homeTeamId: number | null;
    awayTeamId: number | null;
    userResults: Array<{ homeGoals: number; awayGoals: number }>;
  }>
): PlayedGroupMatch[] {
  return matches
    .filter(
      (m) =>
        m.groupLetter &&
        m.homeTeamId &&
        m.awayTeamId &&
        m.userResults.length > 0
    )
    .map((m) => ({
      groupLetter: m.groupLetter!,
      homeTeamId: m.homeTeamId!,
      awayTeamId: m.awayTeamId!,
      homeGoals: m.userResults[0]!.homeGoals,
      awayGoals: m.userResults[0]!.awayGoals,
    }));
}

function buildGroupStandings(
  teams: TeamInfo[],
  playedMatches: PlayedGroupMatch[],
  groupLetter: string
): StandingEntry[] {
  const groupTeams = teams.filter((t) => t.groupLetter === groupLetter);
  const standings = groupTeams.map(createEmptyStanding);
  const groupPlayed = playedMatches.filter((m) => m.groupLetter === groupLetter);

  for (const match of groupPlayed) {
    const home = standings.find((s) => s.teamId === match.homeTeamId);
    const away = standings.find((s) => s.teamId === match.awayTeamId);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeGoals;
    home.goalsAgainst += match.awayGoals;
    away.goalsFor += match.awayGoals;
    away.goalsAgainst += match.homeGoals;

    if (match.homeGoals > match.awayGoals) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
    } else if (match.homeGoals < match.awayGoals) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  for (const row of standings) {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
  }

  return sortStandings(standings, groupPlayed);
}

function formatStandingRow(
  position: number,
  row: StandingEntry,
  teamMap: Map<number, TeamInfo>
) {
  const team = teamMap.get(row.teamId)!;
  return {
    position,
    team_id: team.id,
    name: team.name,
    code: team.code,
    flag_emoji: team.flagEmoji,
    group_letter: team.groupLetter,
    pj: row.played,
    pg: row.wins,
    pe: row.draws,
    pp: row.losses,
    gf: row.goalsFor,
    gc: row.goalsAgainst,
    dg: row.goalDifference,
    pts: row.points,
  };
}

export async function getStandings(userId: number, groupLetter?: string) {
  const teams = await prisma.team.findMany({ orderBy: { id: "asc" } });
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  const matches = await prisma.match.findMany({
    where: { round: "group" },
    include: { userResults: { where: { userId } } },
  });

  const playedMatches = toPlayedMatches(matches);
  const letters = groupLetter ? [groupLetter.toUpperCase()] : [...GROUP_LETTERS];

  if (groupLetter && !GROUP_LETTERS.includes(groupLetter.toUpperCase() as (typeof GROUP_LETTERS)[number])) {
    return null;
  }

  const groups: Record<string, ReturnType<typeof formatStandingRow>[]> = {};

  for (const letter of letters) {
    const sorted = buildGroupStandings(teams, playedMatches, letter);
    groups[letter] = sorted.map((row, i) => formatStandingRow(i + 1, row, teamMap));
  }

  return { groups };
}

/** Clasificados por grupo (1° y 2°) cuando los 6 partidos del grupo están completos. */
export async function getGroupQualifiers(userId: number): Promise<GroupQualifiers> {
  const teams = await prisma.team.findMany({ orderBy: { id: "asc" } });
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  const matches = await prisma.match.findMany({
    where: { round: "group" },
    include: { userResults: { where: { userId } } },
  });

  const playedMatches = toPlayedMatches(matches);
  const result: GroupQualifiers = new Map();

  for (const letter of GROUP_LETTERS) {
    const groupMatches = matches.filter((m) => m.groupLetter === letter);
    const allPlayed =
      groupMatches.length > 0 && groupMatches.every((m) => m.userResults.length > 0);

    if (!allPlayed) {
      result.set(letter, { winner: null, runnerUp: null });
      continue;
    }

    const sorted = buildGroupStandings(teams, playedMatches, letter);
    const toShape = (teamId: number): TeamShape => {
      const t = teamMap.get(teamId)!;
      return { id: t.id, name: t.name, code: t.code, flag_emoji: t.flagEmoji };
    };

    result.set(letter, {
      winner: sorted[0] ? toShape(sorted[0].teamId) : null,
      runnerUp: sorted[1] ? toShape(sorted[1].teamId) : null,
    });
  }

  return result;
}
