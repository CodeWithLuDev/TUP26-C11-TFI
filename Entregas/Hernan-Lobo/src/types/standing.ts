import type { GroupLetter } from './team';

export interface Standing {
  teamId: string;
  group: GroupLetter;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export type GroupStandings = Record<GroupLetter, Standing[]>;
