import { useAppContext } from '../../hooks/useAppContext';
import { Badge } from '../ui/Badge';
import { TeamCard } from './TeamCard';

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;

export function TeamList() {
  const { state } = useAppContext();

  return (
    <div className="grid grid-cols-1 bg-white/15 rounded sm:grid-cols-2 lg:grid-cols-4 gap-10 p-6">
      {groups.map((letter) => {
        const groupTeams = state.teams.filter((t) => t.group === letter);
        return (
          <div key={letter}>
            <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
              Grupo {letter}
              <Badge>{groupTeams.length} equipos</Badge>
            </h3>
            <div className="space-y-2">
              {groupTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
