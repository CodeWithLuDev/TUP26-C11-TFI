import { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import type { Match, MatchResult, GoalEvent } from '../types';
import { MatchCard } from '../components/matches/MatchCard';
import { ResultForm } from '../components/matches/ResultForm';
import { Badge } from '../components/ui/Badge';

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;

export function FixturePage() {
  const { state, dispatch } = useAppContext();
  const [selectedGroup, setSelectedGroup] = useState<string>('A');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const groupMatches = state.matches.filter(
    (m) => m.stage === 'group' && m.group === selectedGroup
  );

  const rounds = [...new Set(groupMatches.map((m) => m.round))].sort() as number[];

  function handleSelectMatch(match: Match) {
    setSelectedMatch(match);
  }

  function handleSubmitResult(matchId: string, result: MatchResult, goals: GoalEvent[]) {
    dispatch({ type: 'SET_MATCH_RESULT', payload: { matchId, result, goals } });
    setSelectedMatch(null);
  }

  function handleResetResult(matchId: string) {
    dispatch({ type: 'RESET_MATCH_RESULT', payload: { matchId } });
    setSelectedMatch(null);
  }

  const totalCount = groupMatches.length;
  const playedCount = groupMatches.filter((m) => m.status === 'played').length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Fixture de Partidos</h2>
          <p className="text-sm text-gray-400 mt-1">
            Fase de grupos &middot; {playedCount} de {totalCount} jugados
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {groups.map((g) => {
            const groupPlayed = state.matches.filter(
              (m) => m.stage === 'group' && m.group === g && m.status === 'played'
            ).length;
            const groupTotal = state.matches.filter(
              (m) => m.stage === 'group' && m.group === g
            ).length;
            const isComplete = groupPlayed === groupTotal && groupTotal > 0;

            return (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedGroup === g
                    ? 'bg-blue-600 text-white'
                    : 'bg-black/50 text-gray-300 hover:bg-white/20'
                }`}
              >
                Grupo {g}
                {isComplete && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {rounds.length === 0 ? (
        <div className="text-center py-16 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-gray-500">No se encontraron partidos para este grupo.</p>
        </div>
      ) : (
        rounds.map((round) => (
          <div key={round} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold text-gray-200">
                Jornada {round}
              </h3>
              <Badge>
                {groupMatches.filter((m) => m.round === round && m.status === 'played').length}
                /{groupMatches.filter((m) => m.round === round).length} jugados
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupMatches
                .filter((m) => m.round === round)
                .map((match) => {
                  const homeTeam = state.teams.find((t) => t.id === match.homeTeamId);
                  const awayTeam = state.teams.find((t) => t.id === match.awayTeamId);

                  return (
                    <MatchCard
                      key={match.id}
                      match={match}
                      homeTeam={homeTeam}
                      awayTeam={awayTeam}
                      onSelect={handleSelectMatch}
                    />
                  );
                })}
            </div>
          </div>
        ))
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
