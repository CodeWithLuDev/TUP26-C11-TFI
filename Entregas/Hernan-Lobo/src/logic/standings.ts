import type { Match, Team, GroupStandings, GroupLetter } from '../types';
import { sortStandings } from './tiebreakers';

const GROUP_LETTERS: GroupLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/**
 * Crea las entradas iniciales de tabla con todos los valores en 0
 * para los equipos de un grupo específico.
 */
function createEmptyStandings(teams: Team[], group: GroupLetter) {
  return teams
    .filter((t) => t.group === group)
    .map((t) => ({
      teamId: t.id,
      group,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    }));
}

/**
 * Recorre todos los partidos de grupo jugados y recalcula
 * PJ, PG, PE, PP, GF, GC, DG y PTS para cada equipo.
 * Aplica sistema FIFA: victoria = 3 pts, empate = 1 pt.
 * Finalmente ordena cada grupo según criterios FIFA.
 */
export function recalculateStandings(matches: Match[], teams: Team[]): GroupStandings {
  const standings = {} as GroupStandings;

  for (const letter of GROUP_LETTERS) {
    standings[letter] = createEmptyStandings(teams, letter);
  }

  const playedGroupMatches = matches.filter(
    (m) => m.stage === 'group' && m.status === 'played' && m.result
  );

  for (const match of playedGroupMatches) {
    const { homeTeamId, awayTeamId, result, group } = match;
    if (!result || !group) continue;

    const homeStanding = standings[group]?.find((s) => s.teamId === homeTeamId);
    const awayStanding = standings[group]?.find((s) => s.teamId === awayTeamId);
    if (!homeStanding || !awayStanding) continue;

    homeStanding.played += 1;
    awayStanding.played += 1;
    homeStanding.goalsFor += result.homeGoals;
    homeStanding.goalsAgainst += result.awayGoals;
    awayStanding.goalsFor += result.awayGoals;
    awayStanding.goalsAgainst += result.homeGoals;

    if (result.homeGoals > result.awayGoals) {
      homeStanding.wins += 1;
      homeStanding.points += 3;
      awayStanding.losses += 1;
    } else if (result.homeGoals < result.awayGoals) {
      awayStanding.wins += 1;
      awayStanding.points += 3;
      homeStanding.losses += 1;
    } else {
      homeStanding.draws += 1;
      awayStanding.draws += 1;
      homeStanding.points += 1;
      awayStanding.points += 1;
    }
  }

  // Calcula diferencia de gol y ordena usando criterios FIFA
  for (const letter of GROUP_LETTERS) {
    for (const s of standings[letter]) {
      s.goalDifference = s.goalsFor - s.goalsAgainst;
    }
    standings[letter] = sortStandings(standings[letter], matches);
  }

  return standings;
}
