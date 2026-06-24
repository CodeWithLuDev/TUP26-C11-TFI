import type { FixtureMatch, Team } from '../types/api'
import { groupBy } from '../utils/format'
import { EmptyState, SectionHeader } from './ui/States'

export function TeamGrid({ teams, fixture }: { teams: Team[]; fixture: FixtureMatch[] }) {
  const teamsByGroup = groupBy(teams, (team) => team.group_letter)
  const playedMatches = fixture.filter((match) => match.user_result).length

  if (teams.length === 0) {
    return (
      <EmptyState
        title="Todavia no hay equipos"
        message="Cuando el backend devuelva los equipos precargados del Mundial, apareceran organizados por grupo."
      />
    )
  }

  return (
    <section>
      <SectionHeader
        eyebrow="Pantalla principal"
        title="Equipos participantes"
        description="La portada muestra los 32 equipos precargados en la base de datos, con bandera, codigo FIFA y grupo."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Equipos" value={teams.length.toString()} />
        <Metric label="Grupos" value={Object.keys(teamsByGroup).length.toString()} />
        <Metric label="Resultados cargados" value={playedMatches.toString()} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {Object.entries(teamsByGroup).map(([group, groupTeams]) => (
          <article
            key={group}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-card backdrop-blur"
          >
            <header className="flex items-center justify-between border-b border-white/10 bg-slate-950/35 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-gold">Grupo</p>
                <h3 className="text-3xl font-black text-white">{group}</h3>
              </div>
              <span className="rounded-full border border-emerald-300/30 px-3 py-1 text-xs font-bold text-emerald-100">
                {groupTeams.length} selecciones
              </span>
            </header>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {groupTeams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                      {team.flag_emoji}
                    </span>
                    <div>
                      <h4 className="font-black text-white">{team.name}</h4>
                      <p className="text-sm font-bold text-emerald-100/75">{team.code}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-card backdrop-blur">
      <p className="text-sm font-bold text-emerald-100/70">{label}</p>
      <p className="mt-2 text-4xl font-black text-white">{value}</p>
    </div>
  )
}
