import type { Match, GroupStandings, GroupLetter } from '../types';
import type { BracketMatch, BracketRound, BracketRoundName } from '../types/playoff';

const GROUP_LETTERS: GroupLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

interface QualifiedTeam {
  teamId: string;
  group: GroupLetter;
  position: number;
}

/** Obtiene los 2 primeros de cada grupo (16 equipos en total) */
export function getQualifiedTeams(standings: GroupStandings): QualifiedTeam[] {
  const result: QualifiedTeam[] = [];
  for (const letter of GROUP_LETTERS) {
    const group = standings[letter];
    if (group.length >= 2) {
      result.push({ teamId: group[0].teamId, group: letter, position: 1 });
      result.push({ teamId: group[1].teamId, group: letter, position: 2 });
    }
  }
  return result;
}

function findQualifiedTeamId(
  qualified: QualifiedTeam[],
  group: string,
  position: number
): string | undefined {
  return qualified.find(
    (q) => q.group === group && q.position === position
  )?.teamId;
}

/**
 * Dado un resultado (con penales opcionales), determina el ID del ganador.
 * Si el resultado está empatado y no hay penales, devuelve string vacío.
 */
function getWinner(result: { homeGoals: number; awayGoals: number; penalties?: { homeGoals: number; awayGoals: number } }, homeTeamId: string, awayTeamId: string): string {
  if (result.homeGoals > result.awayGoals) return homeTeamId;
  if (result.homeGoals < result.awayGoals) return awayTeamId;
  if (result.penalties) {
    return result.penalties.homeGoals > result.penalties.awayGoals
      ? homeTeamId
      : awayTeamId;
  }
  return '';
}

/** Devuelve el perdedor invirtiendo la lógica de getWinner */
function getLoser(result: { homeGoals: number; awayGoals: number; penalties?: { homeGoals: number; awayGoals: number } }, homeTeamId: string, awayTeamId: string): string {
  const winner = getWinner(result, homeTeamId, awayTeamId);
  return winner === homeTeamId ? awayTeamId : homeTeamId;
}

function isGroupStageComplete(matches: Match[]): boolean {
  const groupMatches = matches.filter((m) => m.stage === 'group');
  return groupMatches.length > 0 && groupMatches.every((m) => m.status === 'played');
}

/**
 * Construye una ronda del bracket tomando los ganadores de la ronda anterior.
 * Si los equipos cambiaron respecto al estado guardado, borra el resultado
 * previo para evitar inconsistencias.
 */
function buildRound(
  matches: Match[],
  round: BracketRoundName,
  startIndex: number,
  previousRound: BracketMatch[],
  count: number
): BracketMatch[] {
  const result: BracketMatch[] = [];

  for (let i = 0; i < count; i++) {
    const matchIndex = startIndex + i;
    const match = matches[matchIndex];
    // Cada partido de la ronda anterior alimenta un partido de esta ronda
    const prevMatch1 = previousRound[i * 2];
    const prevMatch2 = previousRound[i * 2 + 1];

    const homeId = prevMatch1?.winnerId ?? '';
    const awayId = prevMatch2?.winnerId ?? '';

    const oldHomeId = match.homeTeamId;
    const oldAwayId = match.awayTeamId;
    const teamsChanged = oldHomeId !== homeId || oldAwayId !== awayId;

    // Si los equipos cambiaron, limpia el resultado para forzar recarga
    matches[matchIndex] = teamsChanged || !match.result
      ? { ...match, homeTeamId: homeId, awayTeamId: awayId, result: undefined, goals: undefined, status: 'scheduled' as const }
      : { ...match, homeTeamId: homeId, awayTeamId: awayId };

    const updatedMatch = matches[matchIndex];
    const winner = updatedMatch.result
      ? getWinner(updatedMatch.result, homeId, awayId)
      : undefined;

    result.push({
      id: match.id,
      round,
      position: i + 1,
      homeTeamId: homeId || undefined,
      awayTeamId: awayId || undefined,
      winnerId: winner,
      matchId: match.id,
      sourceMatchHome: prevMatch1?.id,
      sourceMatchAway: prevMatch2?.id,
    });
  }

  return result;
}

/**
 * Función principal del bracket. Si la fase de grupos no está completa,
 * limpia cualquier dato de playoffs y devuelve bracket vacío.
 * 
 * Formato oficial de octavos (índices 48-55 del array de partidos):
 * 1A vs 2B, 1C vs 2D, 1E vs 2F, 1G vs 2H,
 * 1B vs 2A, 1D vs 2C, 1F vs 2E, 1H vs 2G
 */
export function buildPlayoffs(
  standings: GroupStandings,
  matches: Match[]
): { bracket: BracketRound[]; updatedMatches: Match[] } {
  const updatedMatches = matches.map((m) => ({ ...m }));

  if (!isGroupStageComplete(updatedMatches)) {
    // Limpia todos los partidos de playoffs si la fase de grupos no terminó
    for (let i = 0; i < updatedMatches.length; i++) {
      if (updatedMatches[i].stage !== 'group') {
        updatedMatches[i] = {
          ...updatedMatches[i],
          homeTeamId: '',
          awayTeamId: '',
          result: undefined,
          goals: undefined,
          status: 'scheduled' as const,
        };
      }
    }
    return { bracket: [], updatedMatches };
  }

  const qualified = getQualifiedTeams(standings);

  const roundOf16Pairs: Array<{ homeGroup: string; homePos: number; awayGroup: string; awayPos: number }> = [
    { homeGroup: 'A', homePos: 1, awayGroup: 'B', awayPos: 2 },
    { homeGroup: 'C', homePos: 1, awayGroup: 'D', awayPos: 2 },
    { homeGroup: 'E', homePos: 1, awayGroup: 'F', awayPos: 2 },
    { homeGroup: 'G', homePos: 1, awayGroup: 'H', awayPos: 2 },
    { homeGroup: 'B', homePos: 1, awayGroup: 'A', awayPos: 2 },
    { homeGroup: 'D', homePos: 1, awayGroup: 'C', awayPos: 2 },
    { homeGroup: 'F', homePos: 1, awayGroup: 'E', awayPos: 2 },
    { homeGroup: 'H', homePos: 1, awayGroup: 'G', awayPos: 2 },
  ];

  const roundOf16: BracketMatch[] = roundOf16Pairs.map((pair, i) => {
    const matchIndex = 48 + i;
    const match = updatedMatches[matchIndex];
    const homeId = findQualifiedTeamId(qualified, pair.homeGroup, pair.homePos) ?? '';
    const awayId = findQualifiedTeamId(qualified, pair.awayGroup, pair.awayPos) ?? '';

    const oldHomeId = match.homeTeamId;
    const oldAwayId = match.awayTeamId;
    const teamsChanged = oldHomeId !== homeId || oldAwayId !== awayId;

    updatedMatches[matchIndex] = teamsChanged || !match.result
      ? { ...match, homeTeamId: homeId, awayTeamId: awayId, result: undefined, goals: undefined, status: 'scheduled' as const }
      : { ...match, homeTeamId: homeId, awayTeamId: awayId };

    const updatedMatch = updatedMatches[matchIndex];
    const winner = updatedMatch.result
      ? getWinner(updatedMatch.result, homeId, awayId)
      : undefined;

    return {
      id: match.id,
      round: 'round_of_16' as BracketRoundName,
      position: i + 1,
      homeTeamId: homeId || undefined,
      awayTeamId: awayId || undefined,
      winnerId: winner,
      matchId: match.id,
    };
  });

  const quarterFinals = buildRound(updatedMatches, 'quarter_final', 56, roundOf16, 4);
  const semiFinals = buildRound(updatedMatches, 'semi_final', 60, quarterFinals, 2);

  const thirdPlace = buildThirdPlace(updatedMatches, semiFinals, 62);
  const final = buildRound(updatedMatches, 'final', 63, semiFinals, 1);

  const bracket: BracketRound[] = [
    { name: 'Round of 16', matches: roundOf16 },
    { name: 'Quarter-finals', matches: quarterFinals },
    { name: 'Semi-finals', matches: semiFinals },
    { name: 'Third Place', matches: thirdPlace },
    { name: 'Final', matches: final },
  ];

  return { bracket, updatedMatches };
}

/**
 * Arma el partido por el tercer puesto usando los perdedores de ambas semifinales.
 * Si las semis no tienen resultado, deja los equipos vacíos.
 */
function buildThirdPlace(
  matches: Match[],
  semiFinals: BracketMatch[],
  matchIndex: number
): BracketMatch[] {
  const match = matches[matchIndex];
  const semi1 = semiFinals[0];
  const semi2 = semiFinals[1];

  const semi1Home = semi1?.homeTeamId ?? '';
  const semi1Away = semi1?.awayTeamId ?? '';
  const semi2Home = semi2?.homeTeamId ?? '';
  const semi2Away = semi2?.awayTeamId ?? '';

  const homeId = semi1?.winnerId
    ? getLoser(
        matches.find((m) => m.id === semi1.matchId)?.result ?? { homeGoals: 0, awayGoals: 0 },
        semi1Home,
        semi1Away
      )
    : semi1Away;

  const awayId = semi2?.winnerId
    ? getLoser(
        matches.find((m) => m.id === semi2.matchId)?.result ?? { homeGoals: 0, awayGoals: 0 },
        semi2Home,
        semi2Away
      )
    : semi2Away;

  const oldHomeId = match.homeTeamId;
  const oldAwayId = match.awayTeamId;
  const teamsChanged = oldHomeId !== homeId || oldAwayId !== awayId;

  matches[matchIndex] = teamsChanged || !match.result
    ? { ...match, homeTeamId: homeId, awayTeamId: awayId, result: undefined, goals: undefined, status: 'scheduled' as const }
    : { ...match, homeTeamId: homeId, awayTeamId: awayId };

  const updatedMatch = matches[matchIndex];
  const winner = updatedMatch.result
    ? getWinner(updatedMatch.result, homeId, awayId)
    : undefined;

  return [{
    id: match.id,
    round: 'third_place' as BracketRoundName,
    position: 1,
    homeTeamId: homeId || undefined,
    awayTeamId: awayId || undefined,
    winnerId: winner,
    matchId: match.id,
    sourceMatchHome: semi1?.id,
    sourceMatchAway: semi2?.id,
  }];
}

/**
 * Determina la etapa actual del torneo según los partidos jugados:
 * - 'group': si aún hay partidos de grupo sin jugar
 * - 'playoffs': si todos los grupos terminaron pero la final no
 * - 'finished': si la final ya se jugó
 */
export function getTournamentStage(matches: Match[]): 'group' | 'playoffs' | 'finished' {
  const groupMatches = matches.filter((m) => m.stage === 'group');
  const allGroupPlayed = groupMatches.length > 0 && groupMatches.every((m) => m.status === 'played');
  if (!allGroupPlayed) return 'group';

  const finalMatch = matches.find((m) => m.stage === 'final');
  if (finalMatch?.status === 'played') return 'finished';

  return 'playoffs';
}
