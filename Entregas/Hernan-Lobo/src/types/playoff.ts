export type BracketRoundName =
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'final'
  | 'third_place';

export interface BracketMatch {
  id: string;
  round: BracketRoundName;
  position: number;
  homeTeamId?: string;
  awayTeamId?: string;
  winnerId?: string;
  matchId?: string;
  sourceMatchHome?: string;
  sourceMatchAway?: string;
}

export interface BracketRound {
  name: string;
  matches: BracketMatch[];
}
