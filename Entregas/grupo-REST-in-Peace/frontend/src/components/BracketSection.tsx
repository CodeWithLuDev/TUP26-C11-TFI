import { useState } from 'react'
import type { BracketMatch, BracketResponse } from '../types/api'
import { cx, formatShortDate } from '../utils/format'
import { FlagBadge } from './ui/FlagBadge'
import { EmptyState, SectionHeader } from './ui/States'

export function BracketSection({ bracket }: { bracket: BracketResponse | null }) {
  const [activeMatchId, setActiveMatchId] = useState<number | null>(null)

  if (!bracket) {
    return (
      <EmptyState
        title="Bracket no disponible"
        message="La llave se obtiene desde el backend una vez que exista informacion del usuario."
      />
    )
  }

  const leftR16 = bracket.rounds.R16.slice(0, 4)
  const rightR16 = bracket.rounds.R16.slice(4)
  const leftQF = bracket.rounds.QF.slice(0, 2)
  const rightQF = bracket.rounds.QF.slice(2)
  const leftSF = bracket.rounds.SF.slice(0, 1)
  const rightSF = bracket.rounds.SF.slice(1)
  const finalMatches = bracket.rounds.final
  const thirdPlaceMatches = bracket.rounds['3rd']

  return (
    <section>
      <SectionHeader
        eyebrow="Eliminacion directa"
        title="Live knockout bracket"
        description="Segui las eliminatorias del torneo con cruces en vivo, ganadores destacados y el avance de cada fase hacia la final."
      />

      {!bracket.groups_complete ? (
        <div className="qatar-panel mb-6 rounded-[2rem] p-5 text-pearl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-gold">
                Clasificacion pendiente
              </p>
              <p className="mt-2 text-lg font-black text-white">
                La fase de grupos todavia no esta completa.
              </p>
              <p className="mt-1 text-sm text-emerald-50/75">
                Carga los 48 resultados de grupos para definir octavos.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="qatar-panel overflow-visible rounded-[2rem] p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">
              Tournament live view
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">Camino a la final</h3>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="qatar-chip rounded-full px-3 py-1">Ganador resaltado</span>
          </div>
        </div>

        <div className="overflow-visible pb-2">
          <div className="bracket-mirror-grid">
            <BracketColumn
              label="Octavos"
              count={leftR16.length}
              matches={leftR16}
              activeMatchId={activeMatchId}
              onActivate={setActiveMatchId}
              side="left"
            />
            <BracketColumn
              label="Cuartos"
              count={leftQF.length}
              matches={leftQF}
              activeMatchId={activeMatchId}
              onActivate={setActiveMatchId}
              side="left"
              className="pt-10"
              listClassName="gap-14"
            />
            <BracketColumn
              label="Semifinal"
              count={leftSF.length}
              matches={leftSF}
              activeMatchId={activeMatchId}
              onActivate={setActiveMatchId}
              side="left"
              className="pt-24"
            />

            <div className="bracket-center-column">
              <RoundHeader label="Final" count={finalMatches.length} />
              <div className="space-y-4 pt-16">
                {finalMatches.map((match) => (
                  <BracketCard
                    key={match.match_id}
                    match={match}
                    isActive={activeMatchId === match.match_id}
                    onActivate={() => setActiveMatchId(match.match_id)}
                  />
                ))}
              </div>
              {thirdPlaceMatches.length > 0 ? (
                <div className="pt-5">
                  <RoundHeader label="Tercer puesto" count={thirdPlaceMatches.length} compact />
                  <div className="space-y-4 pt-3">
                    {thirdPlaceMatches.map((match) => (
                      <BracketCard
                        key={match.match_id}
                        match={match}
                        isActive={activeMatchId === match.match_id}
                        onActivate={() => setActiveMatchId(match.match_id)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              </div>

            <BracketColumn
              label="Semifinal"
              count={rightSF.length}
              matches={rightSF}
              activeMatchId={activeMatchId}
              onActivate={setActiveMatchId}
              side="right"
              className="pt-24"
            />
            <BracketColumn
              label="Cuartos"
              count={rightQF.length}
              matches={rightQF}
              activeMatchId={activeMatchId}
              onActivate={setActiveMatchId}
              side="right"
              className="pt-10"
              listClassName="gap-14"
            />
            <BracketColumn
              label="Octavos"
              count={rightR16.length}
              matches={rightR16}
              activeMatchId={activeMatchId}
              onActivate={setActiveMatchId}
              side="right"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function BracketColumn({
  label,
  count,
  matches,
  activeMatchId,
  onActivate,
  side,
  className,
  listClassName,
}: {
  label: string
  count: number
  matches: BracketMatch[]
  activeMatchId: number | null
  onActivate: (matchId: number) => void
  side: 'left' | 'right'
  className?: string
  listClassName?: string
}) {
  return (
    <div className={cx('bracket-stage', side === 'right' && 'bracket-stage-right', className)}>
      <RoundHeader label={label} count={count} />
      <div className={cx('bracket-column-list gap-3', listClassName)}>
        {matches.map((match) => (
          <BracketCard
            key={match.match_id}
            match={match}
            isActive={activeMatchId === match.match_id}
            onActivate={() => onActivate(match.match_id)}
          />
        ))}
      </div>
    </div>
  )
}

function RoundHeader({ label, count, compact = false }: { label: string; count: number; compact?: boolean }) {
  return (
    <header className={cx('mb-3 rounded-2xl border border-white/10 bg-white/[0.07] p-2.5 text-center', compact && 'p-2')}>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">{count} matches</p>
      <h3 className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-white">{label}</h3>
      <div className="qatar-divider mx-auto mt-2 h-px w-14" />
    </header>
  )
}

function BracketCard({
  match,
  isActive,
  onActivate,
}: {
  match: BracketMatch
  isActive: boolean
  onActivate: () => void
}) {
  const hasResult = Boolean(match.user_result)
  const isFinal = match.round === 'final'
  const animateAdvancedTeams = match.round !== 'R16'
  const statusLabel = !match.is_ready
    ? 'Pendiente'
    : hasResult
      ? 'Finalizado'
      : 'Listo'

  return (
    <article
      className={cx(
        'bracket-match group rounded-2xl p-2.5',
        isActive && 'bracket-match-active',
        hasResult && 'bracket-match-complete',
      )}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="qatar-chip rounded-full px-2 py-0.5 text-[10px] font-black">
          {match.slot_key ?? match.round}
        </span>
        <span
          className={cx(
            'rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em]',
            hasResult
              ? 'bg-gold text-pitch-950'
              : match.is_ready
                ? 'bg-white/10 text-emerald-50'
                : 'bg-white/5 text-emerald-50/50',
          )}
        >
          {statusLabel}
        </span>
      </div>

      <BracketTeam
        name={match.home_team?.name ?? match.home_source ?? 'Por definir'}
        flag={match.home_team?.flag_emoji}
        code={match.home_team?.code}
        isWinner={match.winner?.code === match.home_team?.code}
        isLoser={hasResult && Boolean(match.home_team?.code) && match.winner?.code !== match.home_team?.code}
        isAdvancing={animateAdvancedTeams && Boolean(match.home_team?.code)}
        isChampion={isFinal && match.winner?.code === match.home_team?.code}
        goals={match.user_result?.home_goals}
      />
      <div className="relative my-1.5 flex items-center justify-center">
        <div className="qatar-divider h-px flex-1" />
        <span className="mx-2 rounded-full border border-white/10 bg-pitch-950 px-1.5 py-0.5 text-[9px] font-black text-gold">
          VS
        </span>
        <div className="qatar-divider h-px flex-1" />
      </div>
      <BracketTeam
        name={match.away_team?.name ?? match.away_source ?? 'Por definir'}
        flag={match.away_team?.flag_emoji}
        code={match.away_team?.code}
        isWinner={match.winner?.code === match.away_team?.code}
        isLoser={hasResult && Boolean(match.away_team?.code) && match.winner?.code !== match.away_team?.code}
        isAdvancing={animateAdvancedTeams && Boolean(match.away_team?.code)}
        isChampion={isFinal && match.winner?.code === match.away_team?.code}
        goals={match.user_result?.away_goals}
      />

      <div className="mt-2 grid gap-1 text-[10px] text-emerald-50/60">
        <p className="flex items-center justify-between gap-3">
          <span>{formatShortDate(match.scheduled_at_utc)}</span>
          <span className="text-right">{match.stadium ?? 'Sede a definir'}</span>
        </p>
      </div>

      {match.winner ? (
        <div className="mt-2 flex items-center gap-1.5 rounded-xl border border-gold/35 bg-gold/10 px-2 py-1.5 text-[10px] font-black text-gold">
          <FlagBadge
            code={match.winner.code}
            emoji={match.winner.flag_emoji}
            label={match.winner.name}
            className="h-5 w-5 rounded-md"
          />
          <span>Avanza: {match.winner.name}</span>
        </div>
      ) : null}

      {!match.is_ready ? (
        <p className="mt-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] font-bold text-emerald-50/65">
          Esperando clasificados
        </p>
      ) : null}
    </article>
  )
}

function BracketTeam({
  name,
  flag,
  code,
  goals,
  isWinner,
  isLoser,
  isAdvancing,
  isChampion,
}: {
  name: string
  flag?: string
  code?: string
  goals?: number
  isWinner: boolean
  isLoser: boolean
  isAdvancing: boolean
  isChampion: boolean
}) {
  return (
    <div
      className={cx(
        'bracket-team flex items-center justify-between gap-2 rounded-xl p-2 transition-all duration-300 ease-out',
        isWinner &&
          'bracket-team-winner border-gold/80 bg-gold/10 text-white shadow-[0_0_24px_rgba(214,170,90,0.16)]',
        isLoser && 'bracket-team-loser opacity-70 saturate-[0.85]',
        isAdvancing && 'bracket-team-advance-in',
        isChampion && 'bracket-team-champion',
        !code && 'bracket-team-pending',
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <FlagBadge code={code} emoji={flag} label={name} className="h-6 w-6 rounded-lg" />
        <div className="min-w-0">
          <p className="truncate text-xs font-black text-white">{name}</p>
          {isChampion ? (
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-gold">
              🏆 Campeon
            </p>
          ) : null}
          <p className="text-[10px] font-bold text-emerald-100/60">{code ?? 'TBD'}</p>
        </div>
      </div>
      <span
        className={cx(
          'flex h-7 w-7 items-center justify-center rounded-lg text-base font-black transition-all duration-300',
          isWinner ? 'bg-gold text-pitch-950 shadow-[0_0_18px_rgba(214,170,90,0.32)]' : 'bg-white/10 text-white',
          isChampion && 'ring-1 ring-gold/70',
        )}
      >
        {goals ?? '-'}
      </span>
    </div>
  )
}

