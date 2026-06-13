import type { Match, ScorerEntry, AssisterEntry } from '../types';

/**
 * Recorre todos los partidos jugados, acumula los goles por jugador+equipo
 * y devuelve el ranking ordenado de mayor a menor.
 */
export function computeTopScorers(matches: Match[]): ScorerEntry[] {
  const goalMap = new Map<string, { playerName: string; teamId: string; goals: number }>();

  for (const match of matches) {
    if (match.status !== 'played' || !match.goals) continue;
    for (const goal of match.goals) {
      const key = `${goal.playerName}-${goal.teamId}`;
      const existing = goalMap.get(key);
      if (existing) {
        existing.goals += 1;
      } else {
        goalMap.set(key, { playerName: goal.playerName, teamId: goal.teamId, goals: 1 });
      }
    }
  }

  return Array.from(goalMap.values())
    .sort((a, b) => b.goals - a.goals)
    .map((entry) => ({ playerName: entry.playerName, teamId: entry.teamId, goals: entry.goals }));
}

/**
 * Recorre todos los partidos jugados, acumula las asistencias por jugador+equipo
 * y devuelve el ranking ordenado de mayor a menor.
 */
export function computeTopAssisters(matches: Match[]): AssisterEntry[] {
  const assistMap = new Map<string, { playerName: string; teamId: string; assists: number }>();

  for (const match of matches) {
    if (match.status !== 'played' || !match.goals) continue;
    for (const goal of match.goals) {
      if (!goal.assistPlayerName) continue;
      const key = `${goal.assistPlayerName}-${goal.teamId}`;
      const existing = assistMap.get(key);
      if (existing) {
        existing.assists += 1;
      } else {
        assistMap.set(key, { playerName: goal.assistPlayerName, teamId: goal.teamId, assists: 1 });
      }
    }
  }

  return Array.from(assistMap.values())
    .sort((a, b) => b.assists - a.assists)
    .map((entry) => ({ playerName: entry.playerName, teamId: entry.teamId, assists: entry.assists }));
}
