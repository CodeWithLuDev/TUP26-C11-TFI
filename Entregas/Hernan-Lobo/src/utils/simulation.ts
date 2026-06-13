import type { Match, MatchResult, GoalEvent, Player, Team } from '../types';
import { matches as allMatches } from '../data/matches';
import { recalculateStandings } from '../logic/standings';
import { buildPlayoffs } from '../logic/playoffs';
import squadsData from '../data/squadsData.json';

const FALLBACK_NAMES = [
  'L. Messi', 'C. Ronaldo', 'K. Mbappé', 'Neymar', 'M. Salah',
  'R. Lewandowski', 'K. De Bruyne', 'V. van Dijk', 'S. Mané', 'H. Kane',
  'E. Haaland', 'L. Suárez', 'S. Agüero', 'A. Griezmann', 'P. Pogba',
  'T. Kroos', 'L. Modrić', 'N. Kanté', 'Mohamed Salah', 'S. Ramos',
  'G. Bale', 'R. Sterling', 'J. Oblak', 'Alisson', 'M. ter Stegen',
  'K. Benzema', 'H. Son', 'Bruno Fernandes', 'Bernardo Silva', 'J. Kimmich',
  'A. Davies', 'J. Bellingham', 'Pedri', 'Gavi', 'V. Osimhen',
];

const POSITION_WEIGHTS: { position: Player['position']; weight: number }[] = [
  { position: 'Forward', weight: 50 },
  { position: 'Midfielder', weight: 30 },
  { position: 'Defender', weight: 15 },
  { position: 'Goalkeeper', weight: 5 },
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSquadPlayer(teamId: string, excludeName?: string): string {
  const squad = (squadsData as Record<string, Player[]>)[teamId];
  if (!squad || squad.length === 0) return pickRandom(FALLBACK_NAMES);

  const roll = Math.random() * 100;
  let cumulative = 0;
  let position: Player['position'] = 'Forward';
  for (const { position: pos, weight } of POSITION_WEIGHTS) {
    cumulative += weight;
    if (roll <= cumulative) { position = pos; break; }
  }

  const candidates = squad.filter((p) => p.position === position && p.name !== excludeName);
  if (candidates.length > 0) return pickRandom(candidates).name;

  const anyCandidates = squad.filter((p) => p.name !== excludeName);
  if (anyCandidates.length > 0) return pickRandom(anyCandidates).name;

  return pickRandom(FALLBACK_NAMES);
}

function generateGroupResult(): MatchResult {
  return {
    homeGoals: randomInt(0, 4),
    awayGoals: randomInt(0, 4),
  };
}

function generatePlayoffResult(): MatchResult {
  const homeGoals = randomInt(0, 4);
  const awayGoals = randomInt(0, 4);
  if (homeGoals !== awayGoals) return { homeGoals, awayGoals };
  const penalties: MatchResult['penalties'] = {
    homeGoals: randomInt(3, 5),
    awayGoals: randomInt(3, 5),
  };
  while (penalties.homeGoals === penalties.awayGoals) {
    penalties.homeGoals = randomInt(3, 5);
    penalties.awayGoals = randomInt(3, 5);
  }
  return { homeGoals, awayGoals, extraTime: true, penalties };
}

function generateGoals(
  result: MatchResult,
  homeTeamId: string,
  awayTeamId: string,
): GoalEvent[] {
  const goals: GoalEvent[] = [];
  const usedMinutes = new Set<number>();

  for (let i = 0; i < result.homeGoals; i++) {
    let minute: number;
    do { minute = randomInt(1, 90 + (result.extraTime ? 30 : 0)); } while (usedMinutes.has(minute));
    usedMinutes.add(minute);
    const scorer = getSquadPlayer(homeTeamId);
    const assist = Math.random() < 0.5 ? getSquadPlayer(homeTeamId, scorer) : undefined;
    goals.push({
      playerName: scorer,
      teamId: homeTeamId,
      minute,
      ...(assist ? { assistPlayerName: assist } : {}),
    });
  }

  for (let i = 0; i < result.awayGoals; i++) {
    let minute: number;
    do { minute = randomInt(1, 90 + (result.extraTime ? 30 : 0)); } while (usedMinutes.has(minute));
    usedMinutes.add(minute);
    const scorer = getSquadPlayer(awayTeamId);
    const assist = Math.random() < 0.5 ? getSquadPlayer(awayTeamId, scorer) : undefined;
    goals.push({
      playerName: scorer,
      teamId: awayTeamId,
      minute,
      ...(assist ? { assistPlayerName: assist } : {}),
    });
  }

  goals.sort((a, b) => a.minute - b.minute);
  return goals;
}

export interface SimulationResult {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  result: MatchResult;
  goals: GoalEvent[];
}

export function generateSimulationResults(teams: { id: string }[]): SimulationResult[] {
  const workingMatches: Match[] = allMatches.map((m) => ({ ...m }));
  const results: SimulationResult[] = [];

  const groupMatches = workingMatches.filter((m) => m.stage === 'group');
  for (const match of groupMatches) {
    const result = generateGroupResult();
    const goals = generateGoals(result, match.homeTeamId, match.awayTeamId);
    const idx = workingMatches.indexOf(match);
    workingMatches[idx] = { ...match, result, goals, status: 'played' };
    results.push({
      matchId: match.id,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      result,
      goals,
    });
  }

  const bracketRoundNames: Record<string, string> = {
    'Round of 16': 'round_of_16',
    'Quarter-finals': 'quarter_final',
    'Semi-finals': 'semi_final',
    'Third Place': 'third_place',
    'Final': 'final',
  };

  const playoffStageOrder: string[] = [
    'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final',
  ];

  for (const targetStage of playoffStageOrder) {
    const standings = recalculateStandings(workingMatches, teams as Team[]);
    const { bracket, updatedMatches } = buildPlayoffs(standings, workingMatches);

    for (let i = 0; i < workingMatches.length; i++) {
      workingMatches[i] = { ...updatedMatches[i] };
    }

    for (const rnd of bracket) {
      const stage = bracketRoundNames[rnd.name];
      if (stage !== targetStage) continue;

      for (const bm of rnd.matches) {
        const match = workingMatches.find((m) => m.id === bm.matchId);
        if (!match || match.status === 'played') continue;
        if (!match.homeTeamId || !match.awayTeamId) continue;

        const result = generatePlayoffResult();
        const goals = generateGoals(result, match.homeTeamId, match.awayTeamId);
        const idx = workingMatches.findIndex((m) => m.id === match.id);
        workingMatches[idx] = { ...match, result, goals, status: 'played' };
        results.push({
          matchId: match.id,
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          result,
          goals,
        });
      }
    }
  }

  for (const r of results) {
    const match = workingMatches.find((m) => m.id === r.matchId);
    if (match) {
      r.homeTeamId = match.homeTeamId;
      r.awayTeamId = match.awayTeamId;
    }
  }

  return results;
}
