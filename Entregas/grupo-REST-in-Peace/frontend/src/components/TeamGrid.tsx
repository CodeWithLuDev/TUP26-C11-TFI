import type { FixtureMatch, Team } from '../types/api'
import { groupBy } from '../utils/format'
import { FlagBadge } from './ui/FlagBadge'
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
        description="Países clasificados para el Mundial de Qatar 2022."
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
            className="sports-card overflow-hidden rounded-3xl"
          >
            <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-pitch-950/35 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-gold">Grupo</p>
                <h3 className="font-display text-4xl font-black text-white">{group}</h3>
              </div>
              <span className="rounded-full border border-emerald-300/30 px-3 py-1 text-xs font-bold text-emerald-100">
                {groupTeams.length} selecciones
              </span>
            </header>
            <div className="relative z-10 grid gap-3 p-4 sm:grid-cols-2">
              {groupTeams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-2xl border border-white/10 bg-pitch-950/35 p-4 transition duration-200 hover:-translate-y-1 hover:border-gold/60 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <FlagBadge code={team.code} emoji={team.flag_emoji} label={team.name} />
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
    <div className="sports-card rounded-3xl p-5">
      <p className="text-sm font-bold text-emerald-100/70">{label}</p>
      <p className="mt-2 font-display text-5xl font-black text-white">{value}</p>
    </div>
  )
}
