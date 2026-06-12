import type { Standing, Team } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';
import { Badge } from '../ui/Badge';

interface GroupStandingsTableProps {
  standings: Standing[];
  teams: Team[];
  groupComplete: boolean;
}

export function GroupStandingsTable({ standings, teams, groupComplete }: GroupStandingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 text-gray-300 uppercase text-xs">
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Equipo</th>
            <th className="px-3 py-2 text-center">PJ</th>
            <th className="px-3 py-2 text-center">PG</th>
            <th className="px-3 py-2 text-center">PE</th>
            <th className="px-3 py-2 text-center">PP</th>
            <th className="px-3 py-2 text-center">GF</th>
            <th className="px-3 py-2 text-center">GC</th>
            <th className="px-3 py-2 text-center">DG</th>
            <th className="px-3 py-2 text-center font-bold">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, idx) => {
            const team = teams.find((t) => t.id === s.teamId);
            const isQualifying = groupComplete && idx < 2;
            return (
              <tr
                key={s.teamId}
                className={`border-t border-white/10 ${
                  isQualifying ? 'bg-green-900/20' : ''
                } hover:bg-white/5 transition-colors`}
              >
                <td className="px-3 py-2.5 text-gray-400 font-mono">{idx + 1}</td>
                <td className="px-3 py-2.5 flex items-center gap-2">
                  {team && <FlagIcon countryCode={team.flag} size="sm" />}
                  <span className="font-medium text-white">{team?.name ?? s.teamId}</span>
                  {isQualifying && <Badge variant="success">C</Badge>}
                </td>
                <td className="px-3 py-2.5 text-center font-mono">{s.played}</td>
                <td className="px-3 py-2.5 text-center font-mono">{s.wins}</td>
                <td className="px-3 py-2.5 text-center font-mono">{s.draws}</td>
                <td className="px-3 py-2.5 text-center font-mono">{s.losses}</td>
                <td className="px-3 py-2.5 text-center font-mono">{s.goalsFor}</td>
                <td className="px-3 py-2.5 text-center font-mono">{s.goalsAgainst}</td>
                <td className={`px-3 py-2.5 text-center font-mono ${
                  s.goalDifference > 0 ? 'text-green-400' : s.goalDifference < 0 ? 'text-red-400' : ''
                }`}>
                  {s.goalDifference > 0 ? '+' : ''}{s.goalDifference}
                </td>
                <td className="px-3 py-2.5 text-center font-bold font-mono text-white">{s.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
