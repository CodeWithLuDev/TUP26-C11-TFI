import type { GroupLetter } from './team';

export type MatchStage =
  | 'group'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'final'
  | 'third_place';

export type MatchStatus = 'scheduled' | 'played';

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  extraTime?: boolean;
  penalties?: {
    homeGoals: number;
    awayGoals: number;
  };
}

export interface GoalEvent {
  playerName: string;
  teamId: string;
  minute: number;
  assistPlayerName?: string;
  isPenalty?: boolean;
}

export interface Match {
  id: string;
  stage: MatchStage;
  group?: GroupLetter;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  timezone: string;
  result?: MatchResult;
  goals?: GoalEvent[];
  status: MatchStatus;
  round?: number;
}
