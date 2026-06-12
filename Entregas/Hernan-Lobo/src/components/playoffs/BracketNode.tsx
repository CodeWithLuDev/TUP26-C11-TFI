import type { BracketMatch } from '../../types/playoff';
import type { Team } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';

interface BracketNodeProps {
  bracketMatch: BracketMatch;
  homeTeam?: Team;
  awayTeam?: Team;
  homeScore?: number;
  awayScore?: number;
  isPlayed: boolean;
  isFinal?: boolean;
  onClick: () => void;
}

export function BracketNode({
  bracketMatch,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  isPlayed,
  isFinal,
  onClick,
}: BracketNodeProps) {
  const hasWinner = !!bracketMatch.winnerId;
  const isHomeWinner = hasWinner && bracketMatch.winnerId === bracketMatch.homeTeamId;
  const isAwayWinner = hasWinner && bracketMatch.winnerId === bracketMatch.awayTeamId;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-black/50 backdrop-blur-sm rounded-lg border-2 p-2.5 transition-all cursor-pointer
        ${isPlayed ? 'border-green-400/60 hover:border-green-400' : 'border-white/20 hover:border-blue-400'}
        ${hasWinner ? 'shadow-sm' : ''}
        ${isFinal ? 'ring-2 ring-red-600 shadow-lg shadow-yellow-500/30' : ''}
        hover:shadow-md active:scale-[0.99]`}
    >
      <div className="flex items-center gap-1.5">
        <div className={`flex items-center gap-1.5 flex-1 min-w-0 py-0.5 px-1 rounded ${isHomeWinner ? 'bg-green-900/40 font-semibold' : ''}`}>
          {homeTeam && <FlagIcon countryCode={homeTeam.flag} size="sm" />}
          <span className={`text-xs truncate ${isHomeWinner ? 'text-green-300' : 'text-gray-300'}`}>
            {homeTeam?.name ?? '—'}
          </span>
          <span className={`ml-auto text-sm font-bold tabular-nums ${isHomeWinner ? 'text-green-300' : 'text-gray-400'}`}>
            {isPlayed ? (homeScore ?? '') : ''}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-0.5">
        <div className={`flex items-center gap-1.5 flex-1 min-w-0 py-0.5 px-1 rounded ${isAwayWinner ? 'bg-green-900/40 font-semibold' : ''}`}>
          {awayTeam && <FlagIcon countryCode={awayTeam.flag} size="sm" />}
          <span className={`text-xs truncate ${isAwayWinner ? 'text-green-300' : 'text-gray-300'}`}>
            {awayTeam?.name ?? '—'}
          </span>
          <span className={`ml-auto text-sm font-bold tabular-nums ${isAwayWinner ? 'text-green-300' : 'text-gray-400'}`}>
            {isPlayed ? (awayScore ?? '') : ''}
          </span>
        </div>
      </div>

      {!isPlayed && bracketMatch.homeTeamId && bracketMatch.awayTeamId && (
        <div className="text-center text-[10px] text-gray-400 mt-1 font-medium">
          Pendiente
        </div>
      )}

      {!bracketMatch.homeTeamId && !bracketMatch.awayTeamId && (
        <div className="text-center text-[10px] text-gray-300 mt-1 italic">
          Por definir
        </div>
      )}
    </button>
  );
}
