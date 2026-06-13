import { useAppContext } from '../hooks/useAppContext';
import { TopScorers } from '../components/stats/TopScorers';
import { TopAssisters } from '../components/stats/TopAssisters';

export function StatsPage() {
  const { state } = useAppContext();

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Estadísticas del Torneo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⚽</span> Goleadores
          </h3>
          <TopScorers scorers={state.topScorers} teams={state.teams} />
        </div>

        <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Asistencias
          </h3>
          <TopAssisters assisters={state.topAssisters} teams={state.teams} />
        </div>
      </div>
    </div>
  );
}
