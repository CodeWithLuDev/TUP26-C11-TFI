import type { Team, Standing, Match } from '../../types';
import { GroupStandingsTable } from './GroupStandingsTable';

interface GroupSectionProps {
  letter: string;
  standings: Standing[];
  teams: Team[];
  matches: Match[];
}

export function GroupSection({ letter, standings, teams, matches }: GroupSectionProps) {
  const groupMatches = matches.filter(
    (m) => m.stage === 'group' && m.group === letter
  );
  const groupComplete = groupMatches.length > 0 && groupMatches.every(
    (m) => m.status === 'played'
  );

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
      <div className="bg-blue-900/30 px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold text-white">Grupo {letter}</h3>
      </div>
      <GroupStandingsTable
        standings={standings}
        teams={teams}
        groupComplete={groupComplete}
      />
    </div>
  );
}
