import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { PlayerCard } from '../components/teams/PlayerCard';
import { FlagIcon } from '../components/ui/FlagIcon';
import squadsData from '../data/squadsData.json';
import type { Player } from '../types';

const positionOrder: Player['position'][] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const positionLabels: Record<Player['position'], string> = {
  Goalkeeper: 'Arqueros',
  Defender: 'Defensores',
  Midfielder: 'Mediocampistas',
  Forward: 'Delanteros',
};

export function TeamPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { state } = useAppContext();

  const team = state.teams.find((t) => t.id === teamId);
  const players = (squadsData as Record<string, Player[]>)[teamId ?? ''] ?? [];

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Equipo no encontrado</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white mb-4 flex items-center gap-1"
      >
        ← Volver
      </button>

      <div className="flex items-center gap-4 mb-8">
        <FlagIcon countryCode={team.flag} size="lg" />
        <div>
          <h2 className="text-2xl font-bold text-white">{team.name}</h2>
          <p className="text-sm text-gray-500">Grupo {team.group}</p>
        </div>
      </div>

      {players.length === 0 && (
        <p className="text-gray-500 text-center py-8">No hay información de plantel disponible</p>
      )}

      <div className="space-y-8">
        {positionOrder.map((pos) => {
          const positionPlayers = players.filter((p) => p.position === pos);
          if (positionPlayers.length === 0) return null;
          return (
            <div key={pos}>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">
                {positionLabels[pos]} ({positionPlayers.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {positionPlayers.map((player) => (
                  <PlayerCard key={`${player.jerseyNum}-${player.name}`} player={player} flagCode={team.flag} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
