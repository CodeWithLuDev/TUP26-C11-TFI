import { useState, useRef, type FormEvent } from 'react';
import type { Match, Team, MatchResult, GoalEvent, Player } from '../../types';
import { Modal } from '../ui/Modal';
import { FlagIcon } from '../ui/FlagIcon';
import squadsData from '../../data/squadsData.json';

interface GoalFormEntry {
  id: number;
  isHome: boolean;    // true = gol del equipo local, false = visitante
  playerName: string;
  assistName: string;
}

interface ResultFormProps {
  match: Match;
  homeTeam?: Team;
  awayTeam?: Team;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (matchId: string, result: MatchResult, goals: GoalEvent[]) => void;
  onReset: (matchId: string) => void;
}

interface FormErrors {
  homeGoals?: string;
  awayGoals?: string;
  homePenalties?: string;
  awayPenalties?: string;
  goals?: string;
}

/** Reconstruye las entradas de goles desde los datos guardados del partido */
function buildInitialGoals(match: Match): GoalFormEntry[] {
  if (match.status === 'played' && match.goals && match.goals.length > 0) {
    return match.goals.map((g, i) => ({
      id: i,
      isHome: g.teamId === match.homeTeamId,
      playerName: g.playerName,
      assistName: g.assistPlayerName ?? '',
    }));
  }
  return [];
}

export function ResultForm({
  match,
  homeTeam,
  awayTeam,
  isOpen,
  onClose,
  onSubmit,
  onReset,
}: ResultFormProps) {
  const isPlayoff = match.stage !== 'group';
  const isEditing = match.status === 'played' && match.result;

  const [homeGoals, setHomeGoals] = useState(
    isEditing ? String(match.result!.homeGoals) : ''
  );
  const [awayGoals, setAwayGoals] = useState(
    isEditing ? String(match.result!.awayGoals) : ''
  );
  const [extraTime, setExtraTime] = useState(
    isEditing ? !!match.result!.extraTime : false
  );
  const [homePenalties, setHomePenalties] = useState(
    isEditing && match.result!.penalties ? String(match.result!.penalties.homeGoals) : ''
  );
  const [awayPenalties, setAwayPenalties] = useState(
    isEditing && match.result!.penalties ? String(match.result!.penalties.awayGoals) : ''
  );
  const [goalEntries, setGoalEntries] = useState<GoalFormEntry[]>(() => buildInitialGoals(match));
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmReset, setConfirmReset] = useState(false);
  const [suggestionTarget, setSuggestionTarget] = useState<{ id: number; field: 'scorer' | 'assist' } | null>(null);
  const suggestionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function getTeamSquad(teamId: string): Player[] {
    return (squadsData as Record<string, Player[]>)[teamId] ?? [];
  }

  /**
   * Filtra jugadores del plantel según el equipo del gol y el texto ingresado.
   * Usa el campo isHome del entry para determinar si el goleador es del local o visitante.
   */
  function getSuggestions(entryId: number, _field: 'scorer' | 'assist', query: string): Player[] {
    const entry = goalEntries.find((g) => g.id === entryId);
    if (!entry) return [];
    const teamId = entry.isHome ? match.homeTeamId : match.awayTeamId;
    const squad = getTeamSquad(teamId);
    const lower = query.toLowerCase();
    return squad.filter((p) => p.name.toLowerCase().includes(lower)).slice(0, 6);
  }

  // Timer para cerrar las sugerencias al perder el foco (con delay para permitir clic)
  function startSuggestionClose() {
    suggestionTimer.current = setTimeout(() => setSuggestionTarget(null), 180);
  }

  function cancelSuggestionClose() {
    if (suggestionTimer.current) clearTimeout(suggestionTimer.current);
  }

  const hgNum = /^\d+$/.test(homeGoals.trim()) ? Number(homeGoals.trim()) : -1;
  const agNum = /^\d+$/.test(awayGoals.trim()) ? Number(awayGoals.trim()) : -1;
  const isDraw = hgNum >= 0 && agNum >= 0 && hgNum === agNum;
  // Los penales solo se habilitan en playoffs cuando hay empate
  const showPenalties = isPlayoff && isDraw;
  const totalGoals = hgNum >= 0 && agNum >= 0 ? hgNum + agNum : 0;

  /**
   * Mantiene sincronizada la cantidad de entradas de goles con el marcador.
   * Si el usuario cambia el resultado (ej: de 2-1 a 3-0), se agregan o
   * eliminan entradas automáticamente.
   */
  function syncGoalEntries(hTotal: number, aTotal: number) {
    const total = hTotal + aTotal;
    setGoalEntries((prev) => {
      if (prev.length === total) return prev;
      if (prev.length < total) {
        const addCount = total - prev.length;
        const newEntries: GoalFormEntry[] = [];
        for (let i = 0; i < addCount; i++) {
          const idx = prev.length + i;
          const homeScored = prev.filter((g) => g.isHome).length + newEntries.filter((g) => g.isHome).length;
          newEntries.push({
            id: idx,
            isHome: homeScored < hTotal,
            playerName: '',
            assistName: '',
          });
        }
        return [...prev, ...newEntries];
      }
      return prev.slice(0, total);
    });
  }

  function updateGoalEntry(id: number, field: Partial<GoalFormEntry>) {
    setGoalEntries((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...field } : g))
    );
  }

  /** Validación completa del formulario antes de guardar */
  function validate(): FormErrors {
    const errs: FormErrors = {};

    const hg = homeGoals.trim();
    const ag = awayGoals.trim();

    if (!hg) {
      errs.homeGoals = 'Obligatorio';
    } else if (!/^\d+$/.test(hg)) {
      errs.homeGoals = 'Debe ser un número entero';
    } else if (Number(hg) < 0) {
      errs.homeGoals = 'No puede ser negativo';
    }

    if (!ag) {
      errs.awayGoals = 'Obligatorio';
    } else if (!/^\d+$/.test(ag)) {
      errs.awayGoals = 'Debe ser un número entero';
    } else if (Number(ag) < 0) {
      errs.awayGoals = 'No puede ser negativo';
    }

    // Valida que los penales no estén empatados
    if (showPenalties) {
      const hp = homePenalties.trim();
      const ap = awayPenalties.trim();
      if (!hp) {
        errs.homePenalties = 'Obligatorio';
      } else if (!/^\d+$/.test(hp)) {
        errs.homePenalties = 'Debe ser un número entero';
      }
      if (!ap) {
        errs.awayPenalties = 'Obligatorio';
      } else if (!/^\d+$/.test(ap)) {
        errs.awayPenalties = 'Debe ser un número entero';
      }
      if (hp && ap && /^\d+$/.test(hp) && /^\d+$/.test(ap) && Number(hp) === Number(ap)) {
        errs.homePenalties = 'Los penales no pueden terminar empatados';
        errs.awayPenalties = 'Los penales no pueden terminar empatados';
      }
    }

    // Verifica que todos los goles tengan nombre de goleador
    if (totalGoals > 0) {
      const emptyNames = goalEntries.some((g) => !g.playerName.trim());
      if (emptyNames) {
        errs.goals = 'Completá el nombre del goleador en todos los goles';
      }
    }

    return errs;
  }

  /** Construye el array de GoalEvent a partir de las entradas del formulario */
  function buildGoals(): GoalEvent[] {
    return goalEntries.map((entry, idx) => ({
      playerName: entry.playerName.trim(),
      teamId: entry.isHome ? match.homeTeamId : match.awayTeamId,
      minute: idx + 1,
      assistPlayerName: entry.assistName.trim() || undefined,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    const result: MatchResult = {
      homeGoals: Number(homeGoals),
      awayGoals: Number(awayGoals),
      extraTime: extraTime || undefined,
    };

    if (showPenalties) {
      result.penalties = {
        homeGoals: Number(homePenalties),
        awayGoals: Number(awayPenalties),
      };
    }

    const goals = buildGoals();
    onSubmit(match.id, result, goals);
    handleClose();
  }

  function handleReset() {
    onReset(match.id);
    handleClose();
  }

  /** Restaura el formulario al estado inicial del partido */
  function handleClose() {
    setErrors({});
    setConfirmReset(false);
    setGoalEntries(buildInitialGoals(match));

    if (isEditing) {
      setHomeGoals(String(match.result!.homeGoals));
      setAwayGoals(String(match.result!.awayGoals));
      setExtraTime(!!match.result!.extraTime);
      setHomePenalties(match.result!.penalties ? String(match.result!.penalties.homeGoals) : '');
      setAwayPenalties(match.result!.penalties ? String(match.result!.penalties.awayGoals) : '');
    } else {
      setHomeGoals('');
      setAwayGoals('');
      setExtraTime(false);
      setHomePenalties('');
      setAwayPenalties('');
    }

    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ingresar Resultado">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Marcador: goles local - visitante */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            {homeTeam && <FlagIcon countryCode={homeTeam.flag} size="lg" />}
              <span className="text-sm font-medium text-white text-center">
                {homeTeam?.name ?? 'Local'}
              </span>
            <input
              type="text"
              inputMode="numeric"
              value={homeGoals}
              onChange={(e) => {
                setHomeGoals(e.target.value);
                const h = /^\d+$/.test(e.target.value.trim()) ? Number(e.target.value.trim()) : -1;
                const a = /^\d+$/.test(awayGoals.trim()) ? Number(awayGoals.trim()) : -1;
                if (h >= 0 && a >= 0) syncGoalEntries(h, a);
              }}
              className={`w-20 text-center text-2xl font-bold py-2 border-2 rounded-lg outline-none
                ${errors.homeGoals ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="0"
              autoFocus
            />
            {errors.homeGoals && (
              <span className="text-xs text-red-600">{errors.homeGoals}</span>
            )}
          </div>

          <span className="text-lg font-bold text-gray-400 mt-8">&ndash;</span>

          <div className="flex flex-col items-center gap-2 flex-1">
            {awayTeam && <FlagIcon countryCode={awayTeam.flag} size="lg" />}
              <span className="text-sm font-medium text-white text-center">
                {awayTeam?.name ?? 'Visitante'}
              </span>
            <input
              type="text"
              inputMode="numeric"
              value={awayGoals}
              onChange={(e) => {
                setAwayGoals(e.target.value);
                const h = /^\d+$/.test(homeGoals.trim()) ? Number(homeGoals.trim()) : -1;
                const a = /^\d+$/.test(e.target.value.trim()) ? Number(e.target.value.trim()) : -1;
                if (h >= 0 && a >= 0) syncGoalEntries(h, a);
              }}
              className={`w-20 text-center text-2xl font-bold py-2 border-2 rounded-lg outline-none
                ${errors.awayGoals ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="0"
            />
            {errors.awayGoals && (
              <span className="text-xs text-red-600">{errors.awayGoals}</span>
            )}
          </div>
        </div>

        {/* Checkbox de tiempo extra (solo en playoffs) */}
        {isPlayoff && (
          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={extraTime}
                onChange={(e) => setExtraTime(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Se definió en tiempo extra
            </label>
          </div>
        )}

        {/* Sección de penales: solo visible en playoffs con marcador empatado */}
        {showPenalties && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-amber-800 mb-2 text-center">
              El partido terminó empatado. Ingresá los penales:
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-600">
                  {homeTeam?.name ?? 'Local'}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={homePenalties}
                  onChange={(e) => setHomePenalties(e.target.value)}
                  className={`w-16 text-center text-black font-bold py-1.5 border-2 rounded-lg outline-none
                    ${errors.homePenalties ? 'border-red-400 bg-red-50' : 'border-amber-300 focus:border-amber-500'}`}
                  placeholder="0"
                />
                {errors.homePenalties && (
                  <span className="text-xs text-red-600">{errors.homePenalties}</span>
                )}
              </div>
              <span className="text-lg font-bold text-amber-600">—</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-600">
                  {awayTeam?.name ?? 'Visitante'}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={awayPenalties}
                  onChange={(e) => setAwayPenalties(e.target.value)}
                  className={`w-16 text-center text-black font-bold py-1.5 border-2 rounded-lg outline-none
                    ${errors.awayPenalties ? 'border-red-400 bg-red-50' : 'border-amber-300 focus:border-amber-500'}`}
                  placeholder="0"
                />
                {errors.awayPenalties && (
                  <span className="text-xs text-red-600">{errors.awayPenalties}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lista dinámica de goles: se genera según el marcador */}
        {totalGoals > 0 && (
          <div className="border-t border-white/20 pt-3">
            <h4 className="text-sm font-semibold text-gray-200 mb-3">
              Goles del partido ({totalGoals})
            </h4>
            <div className="space-y-2">
              {goalEntries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 bg-white/5 rounded-lg p-2.5"
                >
                  <span className="text-xs text-gray-400 font-mono w-5 shrink-0">
                    {idx + 1}
                  </span>

                  {/* Botones Local/Visitante para asignar el equipo del gol */}
                  <div className="flex items-center gap-1 bg-black/50 rounded border border-white/20 p-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateGoalEntry(entry.id, { isHome: true })}
                      className={`text-[11px] px-2 py-0.5 rounded font-medium transition-colors ${
                        entry.isHome
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Local
                    </button>
                    <button
                      type="button"
                      onClick={() => updateGoalEntry(entry.id, { isHome: false })}
                      className={`text-[11px] px-2 py-0.5 rounded font-medium transition-colors ${
                        !entry.isHome
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Visita
                    </button>
                  </div>

                  {/* Input de goleador con autocompletado */}
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="text"
                      value={entry.playerName}
                      onChange={(e) => updateGoalEntry(entry.id, { playerName: e.target.value })}
                      onFocus={() => {
                        cancelSuggestionClose();
                        setSuggestionTarget({ id: entry.id, field: 'scorer' });
                      }}
                      onBlur={startSuggestionClose}
                      placeholder="Nombre del goleador"
                      className="w-full text-sm px-2 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 placeholder-gray-400"
                    />
                    {/* Dropdown de sugerencias filtrado por plantel del equipo */}
                    {suggestionTarget?.id === entry.id && suggestionTarget?.field === 'scorer' && entry.playerName && (
                      <div
                        className="absolute z-50 top-full left-0 right-0 mt-1 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        onMouseDown={cancelSuggestionClose}
                      >
                        {getSuggestions(entry.id, 'scorer', entry.playerName).map((p) => (
                          <button
                            key={p.name}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-gray-900 flex items-center gap-2 transition-colors"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              updateGoalEntry(entry.id, { playerName: p.name });
                              setSuggestionTarget(null);
                            }}
                          >
                            <span className="text-xs text-gray-500 font-mono w-8 shrink-0">#{p.jerseyNum}</span>
                            <span className="truncate">{p.name}</span>
                          </button>
                        ))}
                        {getSuggestions(entry.id, 'scorer', entry.playerName).length === 0 && (
                          <div className="px-3 py-2 text-xs text-gray-500">Sin coincidencias</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Input de asistencia (opcional) con autocompletado */}
                  <div className="relative w-36 shrink-0 hidden sm:block">
                    <input
                      type="text"
                      value={entry.assistName}
                      onChange={(e) => updateGoalEntry(entry.id, { assistName: e.target.value })}
                      onFocus={() => {
                        cancelSuggestionClose();
                        setSuggestionTarget({ id: entry.id, field: 'assist' });
                      }}
                      onBlur={startSuggestionClose}
                      placeholder="Asistencia (opcional)"
                      className="w-full text-sm px-2 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 placeholder-gray-400"
                    />
                    {suggestionTarget?.id === entry.id && suggestionTarget?.field === 'assist' && entry.assistName && (
                      <div
                        className="absolute z-50 top-full left-0 right-0 mt-1 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        onMouseDown={cancelSuggestionClose}
                      >
                        {getSuggestions(entry.id, 'assist', entry.assistName).map((p) => (
                          <button
                            key={p.name}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-gray-900 flex items-center gap-2 transition-colors"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              updateGoalEntry(entry.id, { assistName: p.name });
                              setSuggestionTarget(null);
                            }}
                          >
                            <span className="text-xs text-gray-500 font-mono w-8 shrink-0">#{p.jerseyNum}</span>
                            <span className="truncate">{p.name}</span>
                          </button>
                        ))}
                        {getSuggestions(entry.id, 'assist', entry.assistName).length === 0 && (
                          <div className="px-3 py-2 text-xs text-gray-500">Sin coincidencias</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {errors.goals && (
              <p className="text-xs text-red-600 mt-1">{errors.goals}</p>
            )}
          </div>
        )}

        {/* Botones de acción: Guardar/Actualizar/Eliminar con confirmación */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          {isEditing ? (
            <>
              {confirmReset ? (
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Confirmar Eliminación
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 px-4 py-2 bg-black/50 text-gray-300 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Actualizar Resultado
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="px-4 py-2 bg-black/50 text-gray-400 rounded-lg text-sm font-medium hover:bg-red-900/40 hover:text-red-300 transition-colors"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Guardar Resultado
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
