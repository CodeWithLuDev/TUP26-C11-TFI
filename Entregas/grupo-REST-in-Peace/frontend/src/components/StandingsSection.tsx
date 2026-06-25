import type { StandingsResponse, StandingRow } from '../types/api'
import { FlagBadge } from './ui/FlagBadge'
import { EmptyState, SectionHeader } from './ui/States'

const columns: Array<{ key: keyof StandingRow; label: string; align?: 'left' | 'right' }> = [
  { key: 'pj', label: 'PJ' },
  { key: 'pg', label: 'PG' },
  { key: 'pe', label: 'PE' },
  { key: 'pp', label: 'PP' },
  { key: 'gf', label: 'GF' },
  { key: 'gc', label: 'GC' },
  { key: 'dg', label: 'DG' },
  { key: 'pts', label: 'PTS' },
]

export function StandingsSection({ standings }: { standings: StandingsResponse | null }) {
  const groups = standings?.groups ?? {}

  if (Object.keys(groups).length === 0) {
    return (
      <EmptyState
        title="No hay tablas disponibles"
        message="Las posiciones se calculan desde el backend segun los resultados cargados por el usuario."
      />
    )
  }

  return (
    <section>
      <SectionHeader
        eyebrow="Fase de grupos"
        title="Tablas de posiciones"
        description="Segui el recorrido de cada seleccion en el torneo: sus puntos, goles y todo lo que define su camino hacia la clasificacion."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {Object.entries(groups).map(([group, rows]) => (
          <article
            key={group}
            className="sports-card standings-card overflow-hidden rounded-3xl"
          >
            <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-pitch-950/35 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-gold">Grupo</p>
                <h3 className="font-display text-4xl font-black text-white">{group}</h3>
              </div>
              <p className="text-xs text-emerald-100/70">Orden FIFA</p>
            </header>
            <div className="scrollbar-soft overflow-x-auto">
              <table className="w-full min-w-[560px] table-fixed text-left">
                <thead className="bg-emerald-300/10 text-xs uppercase tracking-[0.2em] text-emerald-100/70">
                  <tr>
                    <th className="w-[42%] px-4 py-3">Equipo</th>
                    {columns.map((column) => (
                      <th key={column.key} className="px-1.5 py-3 text-right sm:px-2">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {rows.map((row) => (
                    <tr key={row.team_id} className="transition hover:bg-white/5">
                      <td className="px-4 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <FlagBadge
                            code={row.code}
                            emoji={row.flag_emoji}
                            label={row.name}
                            className="h-9 w-9 rounded-xl"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-black text-white">{row.name}</p>
                            <p className="text-xs font-bold text-emerald-100/60">{row.code}</p>
                          </div>
                        </div>
                      </td>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-1.5 py-4 text-right text-sm font-bold text-emerald-50/80 sm:px-2"
                        >
                          {row[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
