import type { MatchResult, GoalEvent } from '../types';

/** Acción para simular múltiples partidos en una sola operación atómica */
export interface BulkMatchUpdate {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  result: MatchResult;
  goals: GoalEvent[];
}

export type AppAction =
  /** Carga o modifica el resultado de un partido individual */
  | { type: 'SET_MATCH_RESULT'; payload: { matchId: string; result: MatchResult; goals?: GoalEvent[] } }
  /** Elimina el resultado de un partido, volviéndolo a 'scheduled' */
  | { type: 'RESET_MATCH_RESULT'; payload: { matchId: string } }
  /** Vuelve todo el estado al initialState (limpia todos los resultados) */
  | { type: 'RESET_ALL' }
  /** Simula múltiples partidos a la vez (usado por el simulador automático) */
  | { type: 'BULK_SIMULATE'; payload: { updates: BulkMatchUpdate[] } };
