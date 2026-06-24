import type { RankedAssister, RankedScorer } from '../types/api'
import { FlagBadge } from './ui/FlagBadge'
import { EmptyState, SectionHeader } from './ui/States'

export function StatsSection({
  scorers,
  assisters,
}: {
  scorers: RankedScorer[]
  assisters: RankedAssister[]
}) {
  return (
    <section>
      <SectionHeader
        eyebrow="Rendimiento"
        title="Goleadores y asistencias"
        description="Ranking de goleadores y asistencias."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RankingCard
          title="Top goleadores"
          emptyTitle="Todavia no hay goles"
          emptyMessage="Carga resultados con goleadores para construir el ranking."
          rows={scorers}
          valueLabel="goles"
        />
        <RankingCard
          title="Top asistencias"
          emptyTitle="Todavia no hay asistencias"
          emptyMessage="Las asistencias son opcionales y aparecen cuando se registran en un partido."
          rows={assisters}
          valueLabel="asist."
        />
      </div>
    </section>
  )
}

function RankingCard({
  title,
  rows,
  valueLabel,
  emptyTitle,
  emptyMessage,
}: {
  title: string
  rows: Array<RankedScorer | RankedAssister>
  valueLabel: string
  emptyTitle: string
  emptyMessage: string
}) {
  return (
    <article className="sports-card overflow-hidden rounded-3xl">
      <header className="relative z-10 border-b border-white/10 bg-pitch-950/35 px-5 py-4">
        <h3 className="font-display text-3xl font-black uppercase text-white">{title}</h3>
      </header>
      {rows.length === 0 ? (
        <div className="p-5">
          <EmptyState title={emptyTitle} message={emptyMessage} />
        </div>
      ) : (
        <div className="relative z-10 divide-y divide-white/10">
          {rows.slice(0, 12).map((row) => (
            <div
              key={row.player_id}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-white/10"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-white">
                {row.position}
              </span>
              <FlagBadge
                code={row.team_code}
                emoji={row.flag_emoji}
                label={row.team_name}
                className="h-10 w-10 rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-black text-white">
                  #{row.player_number} {row.player_name}
                </p>
                <p className="text-sm font-bold text-emerald-100/60">
                  {row.team_name} · {row.team_code}
                </p>
              </div>
              <div className="rounded-2xl bg-gold px-4 py-2 text-center text-pitch-950 shadow-lg shadow-gold/10">
                <p className="text-2xl font-black">{'goals' in row ? row.goals : row.assists}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">{valueLabel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
