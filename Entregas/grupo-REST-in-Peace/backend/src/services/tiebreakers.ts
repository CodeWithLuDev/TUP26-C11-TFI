export interface StandingEntry {
  teamId: number;
  groupLetter: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface PlayedGroupMatch {
  groupLetter: string;
  homeTeamId: number;
  awayTeamId: number;
  homeGoals: number;
  awayGoals: number;
}

/**
 * Desempate por enfrentamiento directo entre dos equipos del mismo grupo.
 * Devuelve valor negativo si `a` le ganó a `b`, positivo si `b` le ganó a `a`.
 */
export function resolveHeadToHead(
  a: StandingEntry,
  b: StandingEntry,
  matches: PlayedGroupMatch[]
): number {
  const directMatch = matches.find(
    (m) =>
      m.groupLetter === a.groupLetter &&
      ((m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
        (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId))
  );

  if (!directMatch) return 0;
  if (directMatch.homeGoals === directMatch.awayGoals) return 0;

  const aIsHome = directMatch.homeTeamId === a.teamId;
  const aGoals = aIsHome ? directMatch.homeGoals : directMatch.awayGoals;
  const bGoals = aIsHome ? directMatch.awayGoals : directMatch.homeGoals;

  return bGoals - aGoals;
}

/**
 * Orden FIFA: puntos → DG → GF → enfrentamiento directo → empate (0).
 */
export function sortStandings(
  standings: StandingEntry[],
  matches: PlayedGroupMatch[]
): StandingEntry[] {
  return [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    const headToHead = resolveHeadToHead(a, b, matches);
    if (headToHead !== 0) return headToHead;
    return 0;
  });
}
