import type { AppState } from '../types';
import { teams } from './teams';
import { matches } from './matches';
import { recalculateStandings } from '../logic/standings';

/**
 * Estado inicial del torneo: todos los partidos como 'scheduled',
 * standings calculados desde cero (todo 0), sin playoffs ni estadísticas.
 * Se usa como semilla la primera vez que se carga la app (sin datos previos).
 */
export const initialAppState: AppState = {
  teams,
  matches,
  standings: recalculateStandings(matches, teams),
  playoffs: [],
  topScorers: [],
  topAssisters: [],
  tournamentStage: 'group',
};
