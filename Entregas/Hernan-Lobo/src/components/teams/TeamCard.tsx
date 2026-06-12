import { Link } from 'react-router-dom';
import type { Team } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 p-3 flex items-center gap-3 hover:bg-white/20 transition-all"
    >
      <FlagIcon countryCode={team.flag} size="md" alt={team.name} />
      <span className="font-medium text-white text-sm">{team.name}</span>
      <span className="ml-auto text-xs text-gray-400 uppercase">{team.id}</span>
    </Link>
  );
}
