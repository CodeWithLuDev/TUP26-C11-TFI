import type { Team, GroupLetter } from './team';
import type { Match, MatchStage, MatchStatus, MatchResult, GoalEvent } from './match';
import type { Standing, GroupStandings } from './standing';
import type { BracketRound, BracketRoundName, BracketMatch } from './playoff';
import type { ScorerEntry, AssisterEntry } from './stats';

export type { Player } from './player';
export type {
  GroupLetter,
  Team,
  MatchStage,
  MatchStatus,
  MatchResult,
  GoalEvent,
  Match,
  Standing,
  GroupStandings,
  BracketRoundName,
  BracketMatch,
  BracketRound,
  ScorerEntry,
  AssisterEntry,
};

export interface AppState {
  teams: Team[];
  matches: Match[];
  standings: GroupStandings;
  playoffs: BracketRound[];
  topScorers: ScorerEntry[];
  topAssisters: AssisterEntry[];
  tournamentStage: 'group' | 'playoffs' | 'finished';
}
