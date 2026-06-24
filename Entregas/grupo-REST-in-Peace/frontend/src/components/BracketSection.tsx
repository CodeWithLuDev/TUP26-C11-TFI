import type { BracketMatch, BracketResponse } from '../types/api'
import { formatShortDate, knockoutRounds } from '../utils/format'
import { EmptyState, SectionHeader } from './ui/States'

export function BracketSection({ bracket }: { bracket: BracketResponse | null }) {
  if (!bracket) {
    return (
      <EmptyState
        title="Bracket no disponible"
        message="La llave se obtiene desde el backend una vez que exista informacion del usuario."
      />
    )
  }

  return (
    <section>
      <SectionHeader
        eyebrow="Eliminacion directa"
        title="Llaves de playoffs"
        description="Los cruces se resuelven automaticamente desde clasificados de grupo y ganadores de rondas anteriores."
      />

      {!bracket.groups_complete ? (
        <div className="mb-6 rounded-3xl border border-yellow-300/25 bg-yellow-300/10 p-5 text-yellow-50">
          <p className="font-black">La fase de grupos todavia no esta completa.</p>
          <p className="mt-1 text-sm text-yellow-50/75">
            Carga los 48 resultados de grupos para que el backend defina octavos.
          </p>
        </div>
      ) : null}

      <div className="scrollbar-soft overflow-x-auto pb-4">
        <div className="grid min-w-[1100px] grid-cols-5 gap-4">
          {knockoutRounds.map((round) => (
            <div key={round} className="space-y-4">
              <h3 className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center text-sm font-black uppercase tracking-[0.2em] text-emerald-50">
                {bracket.rounds[round]?.[0]?.round_label ?? round}
              </h3>
              {(bracket.rounds[round] ?? []).map((match) => (
                <BracketCard key={match.match_id} match={match} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BracketCard({ match }: { match: BracketMatch }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-card backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-slate-950/60 px-3 py-1 text-xs font-black text-emerald-100">
          {match.slot_key ?? match.round}
        </span>
        <span className="text-xs text-emerald-50/55">{formatShortDate(match.scheduled_at_utc)}</span>
      </div>

      <BracketTeam
        name={match.home_team?.name ?? match.home_source ?? 'Por definir'}
        flag={match.home_team?.flag_emoji}
        code={match.home_team?.code}
        isWinner={match.winner?.code === match.home_team?.code}
        goals={match.user_result?.home_goals}
      />
      <div className="my-2 text-center text-xs font-black text-emerald-100/40">VS</div>
      <BracketTeam
        name={match.away_team?.name ?? match.away_source ?? 'Por definir'}
        flag={match.away_team?.flag_emoji}
        code={match.away_team?.code}
        isWinner={match.winner?.code === match.away_team?.code}
        goals={match.user_result?.away_goals}
      />

      <p className="mt-3 text-xs text-emerald-50/55">{match.stadium ?? 'Sede a definir'}</p>
      {!match.is_ready ? (
        <p className="mt-3 rounded-2xl bg-yellow-300/10 px-3 py-2 text-xs font-bold text-yellow-100">
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
}: {
  name: string
  flag?: string
  code?: string
  goals?: number
  isWinner: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border p-3 ${
        isWinner ? 'border-gold bg-gold/10' : 'border-white/10 bg-slate-950/35'
      }`}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-white">
          {flag ? `${flag} ` : ''}
          {name}
        </p>
        <p className="text-xs font-bold text-emerald-100/55">{code ?? 'TBD'}</p>
      </div>
      <span className="text-xl font-black text-white">{goals ?? '-'}</span>
    </div>
  )
}
