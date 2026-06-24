import { useMemo, useState } from 'react'
import type { FixtureMatch, SubmitResultPayload } from '../types/api'
import { cx, formatShortDate, getTimezoneLabel, roundLabels } from '../utils/format'
import { ResultModal } from './ResultModal'
import { EmptyState, SectionHeader } from './ui/States'

type FixtureSectionProps = {
  fixture: FixtureMatch[]
  token: string
  onSubmitResult: (matchId: number, payload: SubmitResultPayload) => Promise<void>
  onDeleteResult: (matchId: number) => Promise<void>
}

const roundOptions = [
  { value: 'all', label: 'Todas las rondas' },
  { value: 'group', label: 'Fase de grupos' },
  { value: 'R16', label: 'Octavos' },
  { value: 'QF', label: 'Cuartos' },
  { value: 'SF', label: 'Semifinales' },
  { value: '3rd', label: 'Tercer puesto' },
  { value: 'final', label: 'Final' },
]

export function FixtureSection({
  fixture,
  token,
  onSubmitResult,
  onDeleteResult,
}: FixtureSectionProps) {
  const [roundFilter, setRoundFilter] = useState('all')
  const [groupFilter, setGroupFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'played'>('all')
  const [selectedMatch, setSelectedMatch] = useState<FixtureMatch | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const groups = useMemo(
    () =>
      [...new Set(fixture.map((match) => match.group_letter).filter(Boolean))].sort() as string[],
    [fixture],
  )

  const filteredFixture = fixture.filter((match) => {
    const matchesRound = roundFilter === 'all' || match.round === roundFilter
    const matchesGroup = groupFilter === 'all' || match.group_letter === groupFilter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'played' ? Boolean(match.user_result) : !match.user_result)

    return matchesRound && matchesGroup && matchesStatus
  })

  async function handleDelete(matchId: number) {
    setDeletingId(matchId)
    try {
      await onDeleteResult(matchId)
    } finally {
      setDeletingId(null)
    }
  }

  if (fixture.length === 0) {
    return (
      <EmptyState
        title="Fixture vacio"
        message="El calendario se obtiene desde /api/me/fixture y se mostrara apenas la API devuelva partidos."
      />
    )
  }

  return (
    <section>
      <SectionHeader
        eyebrow="Carga de resultados"
        title="Fixture interactivo"
        description={`Partidos ordenados cronologicamente. Las fechas se muestran en tu zona local (${getTimezoneLabel()}) a partir del horario UTC guardado en la base.`}
      />

      <div className="mb-6 grid gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:grid-cols-3">
        <FilterSelect value={roundFilter} onChange={setRoundFilter} options={roundOptions} />
        <FilterSelect
          value={groupFilter}
          onChange={setGroupFilter}
          options={[
            { value: 'all', label: 'Todos los grupos' },
            ...groups.map((group) => ({ value: group, label: `Grupo ${group}` })),
          ]}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as 'all' | 'pending' | 'played')}
          options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'pending', label: 'Pendientes' },
            { value: 'played', label: 'Con resultado' },
          ]}
        />
      </div>

      {filteredFixture.length === 0 ? (
        <EmptyState
          title="Sin partidos para estos filtros"
          message="Cambia la ronda, grupo o estado para ver otros encuentros."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredFixture.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              deleting={deletingId === match.id}
              onOpen={() => setSelectedMatch(match)}
              onDelete={() => void handleDelete(match.id)}
            />
          ))}
        </div>
      )}

      {selectedMatch ? (
        <ResultModal
          match={selectedMatch}
          token={token}
          onClose={() => setSelectedMatch(null)}
          onSubmit={onSubmitResult}
        />
      ) : null}
    </section>
  )
}

function FilterSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-bold text-white outline-none focus:border-gold"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function MatchCard({
  match,
  deleting,
  onOpen,
  onDelete,
}: {
  match: FixtureMatch
  deleting: boolean
  onOpen: () => void
  onDelete: () => void
}) {
  const isReady = Boolean(match.home_team && match.away_team)
  const result = match.user_result
  const winnerCode =
    result && match.home_team && match.away_team
      ? result.home_goals > result.away_goals
        ? match.home_team.code
        : result.away_goals > result.home_goals
          ? match.away_team.code
          : result.penalty_winner
      : null

  return (
    <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-card backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-gold">
            {roundLabels[match.round]}
            {match.group_letter ? ` · Grupo ${match.group_letter}` : ''}
          </p>
          <p className="mt-1 text-sm text-emerald-50/65">
            {formatShortDate(match.scheduled_at_utc)} · {match.stadium ?? 'Sede a definir'}
          </p>
        </div>
        <span
          className={cx(
            'rounded-full px-3 py-1 text-xs font-black',
            result
              ? 'bg-emerald-300 text-pitch-950'
              : isReady
                ? 'bg-white/10 text-emerald-50'
                : 'bg-yellow-300/15 text-yellow-100',
          )}
        >
          {result ? 'Resultado cargado' : isReady ? 'Listo para cargar' : 'Esperando clasificados'}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamSide
          name={match.home_team?.name ?? match.home_source ?? 'Por definir'}
          flag={match.home_team?.flag_emoji}
          code={match.home_team?.code}
          isWinner={winnerCode === match.home_team?.code}
        />
        <div className="rounded-2xl bg-slate-950/60 px-4 py-3 text-center">
          {result ? (
            <p className="text-3xl font-black text-white">
              {result.home_goals}-{result.away_goals}
            </p>
          ) : (
            <p className="text-xl font-black text-emerald-100/50">VS</p>
          )}
        </div>
        <TeamSide
          name={match.away_team?.name ?? match.away_source ?? 'Por definir'}
          flag={match.away_team?.flag_emoji}
          code={match.away_team?.code}
          isWinner={winnerCode === match.away_team?.code}
        />
      </div>

      {result?.penalty_winner ? (
        <p className="mt-4 rounded-2xl bg-yellow-300/10 px-4 py-2 text-sm font-bold text-yellow-100">
          Ganador por penales: {result.penalty_winner}
        </p>
      ) : null}

      {match.goal_events.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {match.goal_events.slice(0, 6).map((event) => (
            <span
              key={event.id}
              className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-emerald-50/80"
            >
              {event.event_type === 'goal' ? 'Gol' : 'Ast'} · {event.player_name}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onOpen}
          disabled={!isReady}
          className="flex-1 rounded-2xl bg-gold px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-yellow-300 disabled:opacity-50"
        >
          {result ? 'Ver resultado' : 'Cargar resultado'}
        </button>
        {result ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-2xl border border-red-300/30 px-4 py-3 text-sm font-bold text-red-100 transition hover:bg-red-500/10 disabled:opacity-60"
          >
            {deleting ? 'Borrando...' : 'Borrar'}
          </button>
        ) : null}
      </div>
    </article>
  )
}

function TeamSide({
  name,
  flag,
  code,
  isWinner,
}: {
  name: string
  flag?: string
  code?: string
  isWinner: boolean
}) {
  return (
    <div
      className={cx(
        'min-w-0 rounded-2xl border p-3',
        isWinner ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5',
      )}
    >
      <p className="truncate text-sm font-black text-white">
        {flag ? `${flag} ` : ''}
        {name}
      </p>
      <p className="mt-1 text-xs font-bold text-emerald-100/60">{code ?? 'TBD'}</p>
    </div>
  )
}
