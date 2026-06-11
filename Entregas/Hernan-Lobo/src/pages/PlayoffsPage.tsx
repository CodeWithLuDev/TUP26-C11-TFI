import { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import type { Match, MatchResult, GoalEvent, Team } from '../types';
import { BracketView } from '../components/playoffs/BracketView';
import { ResultForm } from '../components/matches/ResultForm';
import { ChampionCelebrationModal } from '../components/playoffs/ChampionCelebrationModal';

/** Determina el equipo campeón a partir del resultado de la final */
function getChampion(match: Match, teams: Team[]): Team | undefined {
  if (!match.result) return undefined;
  const { homeGoals, awayGoals, penalties } = match.result;
  const homeTeam = teams.find((t) => t.id === match.homeTeamId);
  const awayTeam = teams.find((t) => t.id === match.awayTeamId);
  if (!homeTeam || !awayTeam) return undefined;
  if (homeGoals > awayGoals) return homeTeam;
  if (awayGoals > homeGoals) return awayTeam;
  if (penalties) {
    return penalties.homeGoals > penalties.awayGoals ? homeTeam : awayTeam;
  }
  return undefined;
}

export function PlayoffsPage() {
  const { state, dispatch } = useAppContext();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  // Estado separado para el modal de celebración (se abre automáticamente al cargar la final)
  const [celebrationMatch, setCelebrationMatch] = useState<Match | null>(null);
  const [championTeam, setChampionTeam] = useState<Team | null>(null);

  function handleSelectMatch(match: Match) {
    const isFinal = match.stage === 'final';
    const hasResult = match.status === 'played' && match.result;

    // Si es la final y ya tiene resultado, abre el modal de celebración en lugar del formulario
    if (isFinal && hasResult) {
      const champ = getChampion(match, state.teams);
      if (champ) {
        setChampionTeam(champ);
        setCelebrationMatch(match);
        return;
      }
    }
    setSelectedMatch(match);
  }

  function handleCelebrationViewStats() {
    // Al hacer clic en "Ver estadísticas", abre el formulario de la final
    setSelectedMatch(celebrationMatch);
    setCelebrationMatch(null);
    setChampionTeam(null);
  }

  function handleCelebrationClose() {
    setCelebrationMatch(null);
    setChampionTeam(null);
  }

  function handleSubmitResult(matchId: string, result: MatchResult, goals: GoalEvent[]) {
    dispatch({ type: 'SET_MATCH_RESULT', payload: { matchId, result, goals } });
    setSelectedMatch(null);
  }

  function handleResetResult(matchId: string) {
    dispatch({ type: 'RESET_MATCH_RESULT', payload: { matchId } });
    setSelectedMatch(null);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Playoffs</h2>
          {state.playoffs.length > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {state.tournamentStage === 'finished'
                ? 'Torneo finalizado'
                : 'Fase eliminatoria — hacé clic en cada cruce para cargar el resultado'}
            </p>
          )}
        </div>
      </div>

      {state.playoffs.length === 0 ? (
        // Mensaje informativo mientras la fase de grupos no está completa
        <div className="text-center py-16 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20">
          <span className="text-5xl block mb-4">🏆</span>
          <p className="text-gray-300 text-lg">
            Los cruces de playoffs aparecerán una vez que la fase de grupos esté completa.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Cargá los resultados de todos los partidos de grupos para desbloquear la fase eliminatoria.
          </p>
        </div>
      ) : (
        <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-white/20 p-4">
          <BracketView onSelectMatch={handleSelectMatch} />
        </div>
      )}

      {celebrationMatch && championTeam && (
        <ChampionCelebrationModal
          championTeam={championTeam}
          onViewStats={handleCelebrationViewStats}
          onClose={handleCelebrationClose}
        />
      )}

      {selectedMatch && (
        <ResultForm
          match={selectedMatch}
          homeTeam={state.teams.find((t) => t.id === selectedMatch.homeTeamId)}
          awayTeam={state.teams.find((t) => t.id === selectedMatch.awayTeamId)}
          isOpen={true}
          onClose={() => setSelectedMatch(null)}
          onSubmit={handleSubmitResult}
          onReset={handleResetResult}
        />
      )}
    </div>
  );
}
