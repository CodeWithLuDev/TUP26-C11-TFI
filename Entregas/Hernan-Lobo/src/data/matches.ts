import type { Match } from '../types';

// Partidos de fase de grupos (48 partidos, 6 por grupo)
const groupMatches: Omit<Match, 'id'>[] = [
  // Group A
  { stage: 'group', group: 'A', homeTeamId: 'QAT', awayTeamId: 'ECU', date: '2022-11-20', time: '19:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'A', homeTeamId: 'SEN', awayTeamId: 'NED', date: '2022-11-21', time: '19:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'A', homeTeamId: 'QAT', awayTeamId: 'SEN', date: '2022-11-25', time: '16:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'A', homeTeamId: 'NED', awayTeamId: 'ECU', date: '2022-11-25', time: '19:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'A', homeTeamId: 'NED', awayTeamId: 'QAT', date: '2022-11-29', time: '18:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  { stage: 'group', group: 'A', homeTeamId: 'ECU', awayTeamId: 'SEN', date: '2022-11-29', time: '18:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  // Group B
  { stage: 'group', group: 'B', homeTeamId: 'ENG', awayTeamId: 'IRN', date: '2022-11-21', time: '16:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'B', homeTeamId: 'USA', awayTeamId: 'WAL', date: '2022-11-21', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'B', homeTeamId: 'WAL', awayTeamId: 'IRN', date: '2022-11-25', time: '13:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'B', homeTeamId: 'ENG', awayTeamId: 'USA', date: '2022-11-25', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'B', homeTeamId: 'IRN', awayTeamId: 'USA', date: '2022-11-29', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  { stage: 'group', group: 'B', homeTeamId: 'WAL', awayTeamId: 'ENG', date: '2022-11-29', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  // Group C
  { stage: 'group', group: 'C', homeTeamId: 'ARG', awayTeamId: 'KSA', date: '2022-11-22', time: '13:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'C', homeTeamId: 'MEX', awayTeamId: 'POL', date: '2022-11-22', time: '19:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'C', homeTeamId: 'POL', awayTeamId: 'KSA', date: '2022-11-26', time: '16:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'C', homeTeamId: 'ARG', awayTeamId: 'MEX', date: '2022-11-26', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'C', homeTeamId: 'POL', awayTeamId: 'ARG', date: '2022-11-30', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  { stage: 'group', group: 'C', homeTeamId: 'KSA', awayTeamId: 'MEX', date: '2022-11-30', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  // Group D
  { stage: 'group', group: 'D', homeTeamId: 'DEN', awayTeamId: 'TUN', date: '2022-11-22', time: '16:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'D', homeTeamId: 'FRA', awayTeamId: 'AUS', date: '2022-11-22', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'D', homeTeamId: 'TUN', awayTeamId: 'AUS', date: '2022-11-26', time: '13:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'D', homeTeamId: 'FRA', awayTeamId: 'DEN', date: '2022-11-26', time: '19:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'D', homeTeamId: 'AUS', awayTeamId: 'DEN', date: '2022-11-30', time: '18:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  { stage: 'group', group: 'D', homeTeamId: 'TUN', awayTeamId: 'FRA', date: '2022-11-30', time: '18:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  // Group E
  { stage: 'group', group: 'E', homeTeamId: 'GER', awayTeamId: 'JPN', date: '2022-11-23', time: '16:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'E', homeTeamId: 'ESP', awayTeamId: 'CRC', date: '2022-11-23', time: '19:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'E', homeTeamId: 'JPN', awayTeamId: 'CRC', date: '2022-11-27', time: '13:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'E', homeTeamId: 'ESP', awayTeamId: 'GER', date: '2022-11-27', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'E', homeTeamId: 'JPN', awayTeamId: 'ESP', date: '2022-12-01', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  { stage: 'group', group: 'E', homeTeamId: 'CRC', awayTeamId: 'GER', date: '2022-12-01', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  // Group F
  { stage: 'group', group: 'F', homeTeamId: 'MAR', awayTeamId: 'CRO', date: '2022-11-23', time: '13:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'F', homeTeamId: 'BEL', awayTeamId: 'CAN', date: '2022-11-23', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'F', homeTeamId: 'BEL', awayTeamId: 'MAR', date: '2022-11-27', time: '16:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'F', homeTeamId: 'CRO', awayTeamId: 'CAN', date: '2022-11-27', time: '19:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'F', homeTeamId: 'CRO', awayTeamId: 'BEL', date: '2022-12-01', time: '18:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  { stage: 'group', group: 'F', homeTeamId: 'CAN', awayTeamId: 'MAR', date: '2022-12-01', time: '18:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  // Group G
  { stage: 'group', group: 'G', homeTeamId: 'BRA', awayTeamId: 'SRB', date: '2022-11-24', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'G', homeTeamId: 'SUI', awayTeamId: 'CMR', date: '2022-11-24', time: '13:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'G', homeTeamId: 'CMR', awayTeamId: 'SRB', date: '2022-11-28', time: '13:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'G', homeTeamId: 'BRA', awayTeamId: 'SUI', date: '2022-11-28', time: '19:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'G', homeTeamId: 'CMR', awayTeamId: 'BRA', date: '2022-12-02', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  { stage: 'group', group: 'G', homeTeamId: 'SRB', awayTeamId: 'SUI', date: '2022-12-02', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  // Group H
  { stage: 'group', group: 'H', homeTeamId: 'URU', awayTeamId: 'KOR', date: '2022-11-24', time: '16:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'H', homeTeamId: 'POR', awayTeamId: 'GHA', date: '2022-11-24', time: '19:00', timezone: 'UTC+3', status: 'scheduled', round: 1 },
  { stage: 'group', group: 'H', homeTeamId: 'KOR', awayTeamId: 'GHA', date: '2022-11-28', time: '16:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'H', homeTeamId: 'POR', awayTeamId: 'URU', date: '2022-11-28', time: '22:00', timezone: 'UTC+3', status: 'scheduled', round: 2 },
  { stage: 'group', group: 'H', homeTeamId: 'KOR', awayTeamId: 'POR', date: '2022-12-02', time: '18:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
  { stage: 'group', group: 'H', homeTeamId: 'GHA', awayTeamId: 'URU', date: '2022-12-02', time: '18:00', timezone: 'UTC+3', status: 'scheduled', round: 3 },
];

// Partidos de playoffs (16 partidos: 8 octavos + 4 cuartos + 2 semis + 1 tercer puesto + 1 final)
// Los IDs se asignan secuencialmente después de los 48 de grupo

const playoffMatches: Omit<Match, 'id'>[] = [
  // Round of 16
  { stage: 'round_of_16', homeTeamId: '', awayTeamId: '', date: '2022-12-03', time: '18:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'round_of_16', homeTeamId: '', awayTeamId: '', date: '2022-12-03', time: '22:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'round_of_16', homeTeamId: '', awayTeamId: '', date: '2022-12-04', time: '18:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'round_of_16', homeTeamId: '', awayTeamId: '', date: '2022-12-04', time: '22:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'round_of_16', homeTeamId: '', awayTeamId: '', date: '2022-12-05', time: '18:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'round_of_16', homeTeamId: '', awayTeamId: '', date: '2022-12-05', time: '22:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'round_of_16', homeTeamId: '', awayTeamId: '', date: '2022-12-06', time: '18:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'round_of_16', homeTeamId: '', awayTeamId: '', date: '2022-12-06', time: '22:00', timezone: 'UTC+3', status: 'scheduled' },
  // Quarter finals
  { stage: 'quarter_final', homeTeamId: '', awayTeamId: '', date: '2022-12-09', time: '18:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'quarter_final', homeTeamId: '', awayTeamId: '', date: '2022-12-09', time: '22:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'quarter_final', homeTeamId: '', awayTeamId: '', date: '2022-12-10', time: '18:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'quarter_final', homeTeamId: '', awayTeamId: '', date: '2022-12-10', time: '22:00', timezone: 'UTC+3', status: 'scheduled' },
  // Semi finals
  { stage: 'semi_final', homeTeamId: '', awayTeamId: '', date: '2022-12-13', time: '22:00', timezone: 'UTC+3', status: 'scheduled' },
  { stage: 'semi_final', homeTeamId: '', awayTeamId: '', date: '2022-12-14', time: '22:00', timezone: 'UTC+3', status: 'scheduled' },
  // Third place
  { stage: 'third_place', homeTeamId: '', awayTeamId: '', date: '2022-12-17', time: '18:00', timezone: 'UTC+3', status: 'scheduled' },
  // Final
  { stage: 'final', homeTeamId: '', awayTeamId: '', date: '2022-12-18', time: '18:00', timezone: 'UTC+3', status: 'scheduled' },
];

const allMatches = [...groupMatches, ...playoffMatches];

// Asigna IDs tipo 'match-001' a 'match-064' en orden secuencial
export const matches: Match[] = allMatches.map((m, i) => ({
  ...m,
  id: `match-${String(i + 1).padStart(3, '0')}`,
}));
