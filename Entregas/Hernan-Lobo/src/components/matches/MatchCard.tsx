import type { Match, Team } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';
import { Badge } from '../ui/Badge';

interface MatchCardProps {
  match: Match;
  homeTeam?: Team;
  awayTeam?: Team;
  onSelect: (match: Match) => void;
}

export function MatchCard({ match, homeTeam, awayTeam, onSelect }: MatchCardProps) {
  const isPlayed = match.status === 'played';

  return (
    <button
      type="button"
      onClick={() => onSelect(match)}
      className={`w-full text-left bg-black/50 backdrop-blur-sm rounded-lg border p-4 transition-all cursor-pointer
        ${isPlayed ? 'border-green-400/60 hover:border-green-400' : 'border-white/20 hover:border-blue-400'}
        hover:shadow-md active:scale-[0.99]`}
    >
      <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
        <span>{match.date}</span>
        <span>&middot;</span>
        <span>{match.time} {match.timezone}</span>
        {isPlayed && <Badge variant="success">Jugado</Badge>}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {homeTeam && <FlagIcon countryCode={homeTeam.flag} size="sm" />}
          <span className="font-medium text-white text-sm truncate">
            {homeTeam?.name ?? '—'}
          </span>
        </div>

        <div className="shrink-0 w-16 text-center">
          {isPlayed && match.result ? (
            <span className="text-lg font-bold text-white tabular-nums">
              {match.result.homeGoals} &ndash; {match.result.awayGoals}
            </span>
          ) : (
            <span className="text-xs text-gray-400">vs</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="font-medium text-white text-sm truncate">
            {awayTeam?.name ?? '—'}
          </span>
          {awayTeam && <FlagIcon countryCode={awayTeam.flag} size="sm" />}
        </div>
      </div>

      {isPlayed && match.result?.extraTime && (
        <div className="mt-2 text-xs text-center text-amber-400 font-medium">
          Definido en tiempo extra
        </div>
      )}
      {isPlayed && match.result?.penalties && (
        <div className="mt-1 text-xs text-center text-amber-400 font-medium">
          Penales: {match.result.penalties.homeGoals} &ndash; {match.result.penalties.awayGoals}
        </div>
      )}
    </button>
  );
}
