import { useMemo, useState } from 'react'
import { clearStoredSession, getStoredSession } from './api/client'
import { AuthScreen } from './components/AuthScreen'
import { BracketSection } from './components/BracketSection'
import { FixtureSection } from './components/FixtureSection'
import { Navigation, type View } from './components/Navigation'
import { StandingsSection } from './components/StandingsSection'
import { StatsSection } from './components/StatsSection'
import { TeamGrid } from './components/TeamGrid'
import { ErrorState, LoadingState } from './components/ui/States'
import { useTournamentData } from './hooks/useTournamentData'
import type { Session } from './types/api'

function App() {
  const [session, setSession] = useState<Session | null>(() => getStoredSession())
  const [activeView, setActiveView] = useState<View>('home')
  const {
    teams,
    fixture,
    standings,
    bracket,
    scorers,
    assisters,
    isLoading,
    error,
    refresh,
    submitResult,
    deleteResult,
  } = useTournamentData(session)

  const summary = useMemo(() => {
    const played = fixture.filter((match) => match.user_result).length
    const groupMatches = fixture.filter((match) => match.round === 'group')
    const groupPlayed = groupMatches.filter((match) => match.user_result).length
    const champion = bracket?.rounds.final?.[0]?.winner

    return {
      played,
      groupProgress: groupMatches.length > 0 ? Math.round((groupPlayed / groupMatches.length) * 100) : 0,
      champion,
    }
  }, [bracket, fixture])

  if (!session) {
    return <AuthScreen onAuthenticated={setSession} />
  }

  function handleLogout() {
    clearStoredSession()
    setSession(null)
  }

  return (
    <main className="field-lines min-h-screen px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="sticky top-0 z-30 -mx-4 border-b border-white/10 bg-pitch-950/80 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gold">
                REST in Peace
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Fixture del Mundial
              </h1>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <Navigation activeView={activeView} onChange={setActiveView} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-emerald-50 transition hover:bg-white/10"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-white px-4 py-2 text-sm font-black text-pitch-950 transition hover:bg-emerald-50"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="py-8">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-glow backdrop-blur">
            <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-100/70">
                  Usuario: {session.user.username}
                </p>
                <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  Gestiona el torneo como una cabina oficial.
                </h2>
                <p className="mt-4 max-w-2xl text-emerald-50/72">
                  Interfaz React + Tailwind sobre el backend existente: autenticacion, fixture,
                  posiciones, eliminacion directa y estadisticas avanzadas.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <HeroMetric label="Partidos cargados" value={`${summary.played}/${fixture.length}`} />
                <HeroMetric label="Grupos completados" value={`${summary.groupProgress}%`} />
                <HeroMetric
                  label="Campeon"
                  value={summary.champion ? `${summary.champion.flag_emoji} ${summary.champion.code}` : 'TBD'}
                />
              </div>
            </div>
          </div>
        </section>

        {isLoading && teams.length === 0 ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}

        <section className="pb-12">
          {activeView === 'home' ? <TeamGrid teams={teams} fixture={fixture} /> : null}
          {activeView === 'fixture' ? (
            <FixtureSection
              fixture={fixture}
              token={session.token}
              onSubmitResult={submitResult}
              onDeleteResult={deleteResult}
            />
          ) : null}
          {activeView === 'groups' ? <StandingsSection standings={standings} /> : null}
          {activeView === 'bracket' ? <BracketSection bracket={bracket} /> : null}
          {activeView === 'stats' ? <StatsSection scorers={scorers} assisters={assisters} /> : null}
        </section>
      </div>
    </main>
  )
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100/50">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  )
}

export default App
