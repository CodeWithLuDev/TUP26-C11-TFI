import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { clearStoredSession, getStoredSession } from './api/client'
import { AuthScreen } from './components/AuthScreen'
import { BracketSection } from './components/BracketSection'
import { FixtureSection } from './components/FixtureSection'
import { Navigation, type View } from './components/Navigation'
import { StandingsSection } from './components/StandingsSection'
import { StatsSection } from './components/StatsSection'
import { TeamGrid } from './components/TeamGrid'
import { FlagBadge } from './components/ui/FlagBadge'
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
    <main className="stadium-shell min-h-screen px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-gold/10 bg-black/20 p-3 shadow-card backdrop-blur-sm">
        <header className="qatar-navbar sticky top-4 z-30 rounded-2xl px-5 py-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <BrandLockup />
            <Navigation activeView={activeView} onChange={setActiveView} />
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="rounded-xl border border-gold/35 px-4 py-2 text-sm font-bold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-gold/10 hover:text-white"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-gold px-4 py-2 text-sm font-black text-pitch-950 transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </header>

        {activeView === 'home' ? (
          <section className="py-6">
            <div className="hero-stadium overflow-hidden rounded-[1.75rem] shadow-glow">
              <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-100/70">
                    ¡Bienvenido/a {session.user.username}!
                  </p>
                  <h2 className="mt-3 max-w-3xl font-display text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl">
                    FIFA World Cup Fixture Tracker
                  </h2>
                  <p className="mt-4 max-w-2xl text-base font-semibold text-emerald-50/75 sm:text-lg">
                    Completa el fixture partido a partido, segui la evolucion del torneo y descubri
                    quien se convierte en el campeon del mundo.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <HeroMetric label="Partidos cargados" value={`${summary.played}/${fixture.length}`} />
                  <HeroMetric label="Grupos completados" value={`${summary.groupProgress}%`} />
                  <HeroMetric
                    label="Campeon"
                    value={
                      summary.champion ? (
                        <span className="flex items-center gap-2">
                          <FlagBadge
                            code={summary.champion.code}
                            emoji={summary.champion.flag_emoji}
                            label={summary.champion.name}
                            className="h-8 w-8 rounded-xl"
                          />
                          {summary.champion.code}
                        </span>
                      ) : (
                        'TBD'
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {isLoading && teams.length === 0 ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}

        <section className={`${activeView === 'home' ? 'pb-12' : 'pb-12 pt-8 sm:pt-10'}`}>
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

function BrandLockup() {
  return (
    <div className="flex items-center gap-4">
      <img
        src="/qatar-2022-logo-transparent.png"
        alt="FIFA World Cup Qatar 2022"
        className="h-16 w-24 object-contain object-left drop-shadow-[0_0_18px_rgba(255,248,239,0.42)]"
      />
      <div className="hidden leading-none sm:block">
        <p className="font-display text-2xl font-black uppercase tracking-tight text-white">
          FIFA World Cup
        </p>
        <p className="font-display text-3xl font-black uppercase tracking-tight text-emerald-50">
          Qatar 2022
        </p>
      </div>
    </div>
  )
}

function HeroMetric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-pitch-950/50 p-4 shadow-inner transition hover:-translate-y-0.5 hover:border-gold/50">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100/50">{label}</p>
      <p className="mt-2 font-display text-4xl font-black text-white">{value}</p>
    </div>
  )
}

export default App
