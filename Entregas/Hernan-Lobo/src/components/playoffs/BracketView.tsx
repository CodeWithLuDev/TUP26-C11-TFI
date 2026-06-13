import { useAppContext } from '../../hooks/useAppContext';
import type { BracketMatch } from '../../types/playoff';
import type { Match } from '../../types';
import { BracketNode } from './BracketNode';

interface BracketViewProps {
  onSelectMatch: (match: Match) => void;
}

// Altura de cada nodo y ancho de columna para posicionamiento
const CARD_HEIGHT = 82;
const COL_WIDTH = 220;

export function BracketView({ onSelectMatch }: BracketViewProps) {
  const { state } = useAppContext();
  const { playoffs: rounds } = state;

  if (rounds.length === 0) return null;

  const maxNodes = Math.max(...rounds.map((r) => r.matches.length), 0);
  const bracketHeight = maxNodes * (CARD_HEIGHT + 12) + 40;

  function handleClick(bracketMatch: BracketMatch) {
    const match = state.matches.find((m) => m.id === bracketMatch.matchId);
    if (match) onSelectMatch(match);
  }

  // Traducción de nombres de rondas al español
  const roundNameLabels: Record<string, string> = {
    'Round of 16': 'Octavos de Final',
    'Quarter-finals': 'Cuartos de Final',
    'Semi-finals': 'Semifinales',
    'Third Place': 'Tercer Puesto',
    'Final': 'Final',
  };

  // Separa las rondas principales del tercer puesto para renderizarlo aparte
  const mainRounds = rounds.filter((r) => r.name !== 'Third Place');
  const thirdPlaceRound = rounds.find((r) => r.name === 'Third Place');

  function renderColumn(roundName: string, matches: BracketMatch[]) {
    const nodesCount = matches.length;
    return (
      <div key={roundName} className="flex flex-col px-2 shrink-0" style={{ width: COL_WIDTH, minHeight: bracketHeight }}>
        <h3 className="text-sm font-bold mb-3 text-center uppercase tracking-wide pt-2 text-gray-300">
          {roundNameLabels[roundName] ?? roundName}
        </h3>
        {/* Distribuye los nodos uniformemente en el espacio vertical */}
        <div className={`flex flex-col flex-1 ${nodesCount > 1 ? 'justify-evenly' : 'justify-center'}`}>
          {matches.map((bm) => {
            const match = state.matches.find((m) => m.id === bm.matchId);
            const homeTeam = bm.homeTeamId
              ? state.teams.find((t) => t.id === bm.homeTeamId)
              : undefined;
            const awayTeam = bm.awayTeamId
              ? state.teams.find((t) => t.id === bm.awayTeamId)
              : undefined;
            const isPlayed = match?.status === 'played';

            return (
              <div key={bm.id}>
                <BracketNode
                  bracketMatch={bm}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  homeScore={match?.result?.homeGoals}
                  awayScore={match?.result?.awayGoals}
                  isPlayed={isPlayed}
                  isFinal={roundName === 'Final'}
                  onClick={() => handleClick(bm)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderThirdPlaceColumn(matches: BracketMatch[]) {
    return (
      <div className="flex flex-col px-2 shrink-0" style={{ width: COL_WIDTH }}>
        <div className="flex flex-col justify-center">
          {matches.map((bm) => {
            const match = state.matches.find((m) => m.id === bm.matchId);
            const homeTeam = bm.homeTeamId
              ? state.teams.find((t) => t.id === bm.homeTeamId)
              : undefined;
            const awayTeam = bm.awayTeamId
              ? state.teams.find((t) => t.id === bm.awayTeamId)
              : undefined;
            const isPlayed = match?.status === 'played';

            return (
              <div key={bm.id} className="ring-2 ring-amber-500 rounded-lg">
                <BracketNode
                  bracketMatch={bm}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  homeScore={match?.result?.homeGoals}
                  awayScore={match?.result?.awayGoals}
                  isPlayed={isPlayed}
                  onClick={() => handleClick(bm)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    // Scroll horizontal para móvil, flexbox para alinear columnas
    <div className="w-full" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', textAlign: 'center' }}>
      <div className="pb-4">
        <div className="inline-flex items-stretch gap-0">
          {mainRounds.map((round) =>
            renderColumn(round.name, round.matches)
          )}
        </div>
      </div>

      {thirdPlaceRound && thirdPlaceRound.matches.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/20">
          <h3 className="text-lg font-bold text-amber-400 mb-4 text-center">
            🥉 Partido por el Tercer Puesto
          </h3>
          <div className="flex justify-center">
            {renderThirdPlaceColumn(thirdPlaceRound.matches)}
          </div>
        </div>
      )}
    </div>
  );
}
