import { useCallback } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { generateSimulationResults } from '../../utils/simulation';

export function DevTools() {
  const { state, dispatch } = useAppContext();

  const handleSimulate = useCallback(() => {
    const simResults = generateSimulationResults(state.teams);
    dispatch({
      type: 'BULK_SIMULATE',
      payload: { updates: simResults },
    });
  }, [dispatch, state.teams]);

  const handleResetAll = useCallback(() => {
    if (window.confirm('¿Estás seguro de que querés resetear todos los resultados?')) {
      dispatch({ type: 'RESET_ALL' });
    }
  }, [dispatch]);

  return (
    <div className="border-2 border-dashed border-yellow-400/60 bg-yellow-500/10 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-yellow-300 uppercase tracking-wide">
          Herramientas de Desarrollo
        </h3>
        <span className="text-xs font-mono bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">
          Herramientas de Demo
        </span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleSimulate}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm font-medium"
        >
          Simular torneo completo
        </button>
        <button
          onClick={handleResetAll}
          className="px-4 py-2 bg-black/50 text-gray-300 rounded hover:bg-white/20 transition text-sm font-medium"
        >
          Resetear todo
        </button>
      </div>
    </div>
  );
}
