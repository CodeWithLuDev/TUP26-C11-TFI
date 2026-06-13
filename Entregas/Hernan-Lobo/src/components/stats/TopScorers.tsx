import type { ScorerEntry, Team } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';

interface TopScorersProps {
  scorers: ScorerEntry[];
  teams: Team[];
}

export function TopScorers({ scorers, teams }: TopScorersProps) {
  if (scorers.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        Aún no se registraron goles. Cargá resultados con detalles de goles para poblar esta lista.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="bg-white/5 text-gray-300 uppercase text-xs">
            <th className="px-1 sm:px-3 py-2 text-left">#</th>
            <th className="px-1 sm:px-3 py-2 text-left">Jugador</th>
            <th className="px-1 sm:px-3 py-2 text-left">Equipo</th>
            <th className="px-1 sm:px-3 py-2 text-center font-bold">Goles</th>
          </tr>
        </thead>
        <tbody>
          {scorers.map((entry, idx) => {
            const team = teams.find((t) => t.id === entry.teamId);
            return (
              <tr
                key={`${entry.playerName}-${entry.teamId}`}
                className="border-t border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="px-1 sm:px-3 py-2 sm:py-2.5 text-gray-500 font-mono">{idx + 1}</td>
                <td className="px-1 sm:px-3 py-2 sm:py-2.5 font-medium text-white truncate max-w-25 sm:max-w-none">{entry.playerName}</td>
                <td className="px-1 sm:px-3 py-2 sm:py-2.5">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {team && <FlagIcon countryCode={team.flag} size="sm" />}
                    <span className="text-white truncate max-w-17.5 sm:max-w-none">{team?.name ?? entry.teamId}</span>
                  </div>
                </td>
                <td className="px-1 sm:px-3 py-2 sm:py-2.5 text-center">
                  <span className="bg-white/20 rounded px-2 py-0.5 text-white font-bold font-mono text-base sm:text-lg">
                    {entry.goals}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
