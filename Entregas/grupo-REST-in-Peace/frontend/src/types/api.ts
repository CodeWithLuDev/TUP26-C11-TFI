export type User = {
  id: number
  username: string
}

export type Session = {
  token: string
  user: User
}

export type Team = {
  id: number
  name: string
  code: string
  flag_emoji: string
  group_letter: string
}

export type TeamSummary = {
  id: number
  name: string
  code: string
  flag_emoji: string
}

export type Player = {
  id: number
  name: string
  number: number
  team_id: number
}

export type UserResult = {
  home_goals: number
  away_goals: number
  extra_time: number
  penalties: number
  penalty_winner: string | null
}

export type GoalEvent = {
  id: number
  player_id: number
  player_name: string
  event_type: 'goal' | 'assist'
}

export type FixtureMatch = {
  id: number
  round: Round
  group_letter: string | null
  slot_key: string | null
  home_source: string | null
  away_source: string | null
  scheduled_at_utc: string
  stadium: string | null
  home_team: TeamSummary | null
  away_team: TeamSummary | null
  user_result: UserResult | null
  goal_events: GoalEvent[]
}

export type StandingRow = {
  position: number
  team_id: number
  name: string
  code: string
  flag_emoji: string
  group_letter: string
  pj: number
  pg: number
  pe: number
  pp: number
  gf: number
  gc: number
  dg: number
  pts: number
}

export type StandingsResponse = {
  groups: Record<string, StandingRow[]>
}

export type Round = 'group' | 'R16' | 'QF' | 'SF' | '3rd' | 'final'

export type BracketMatch = {
  match_id: number
  slot_key: string | null
  round: Exclude<Round, 'group'>
  round_label: string
  home_source: string | null
  away_source: string | null
  scheduled_at_utc: string
  stadium: string | null
  home_team: TeamSummary | null
  away_team: TeamSummary | null
  is_ready: boolean
  user_result: UserResult | null
  winner: TeamSummary | null
}

export type BracketResponse = {
  groups_complete: boolean
  rounds: Record<Exclude<Round, 'group'>, BracketMatch[]>
}

export type RankedScorer = {
  position: number
  player_id: number
  player_name: string
  player_number: number
  team_id: number
  team_name: string
  team_code: string
  flag_emoji: string
  goals: number
}

export type RankedAssister = Omit<RankedScorer, 'goals'> & {
  assists: number
}

export type SubmitResultPayload = {
  home_goals: number
  away_goals: number
  extra_time?: number
  penalties?: number
  penalty_winner?: string | null
  goal_events?: Array<{
    player_id: number
    event_type: 'goal' | 'assist'
  }>
}

export type ApiErrorBody = {
  error?: string
  code?: string
}
