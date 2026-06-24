import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, api, storeSession } from '../api/client'
import type { Session } from '../types/api'

export function AuthScreen({ onAuthenticated }: { onAuthenticated: (session: Session) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const session =
        mode === 'login'
          ? await api.login(username.trim(), password)
          : await api.register(username.trim(), password)
      storeSession(session)
      onAuthenticated(session)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('No se pudo autenticar con el servidor')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <main className="field-lines min-h-screen px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-100">
            Mundial en tiempo real
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
            Fixture, posiciones y estadisticas con energia de estadio.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/75">
            Gestiona resultados, goleadores, asistencias, tablas y llaves de eliminacion usando
            exclusivamente la API ya implementada.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['32 equipos', '64 partidos', 'JWT + datos por usuario'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-bold text-emerald-100">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-card backdrop-blur-xl sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
              {isLogin ? 'Ingresar' : 'Crear cuenta'}
            </p>
            <h2 className="mt-2 text-3xl font-black">{isLogin ? 'Bienvenido' : 'Nuevo hincha'}</h2>
            <p className="mt-2 text-sm text-emerald-50/70">
              Tus resultados y estadisticas se guardan por usuario en el backend.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-emerald-50">Usuario</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                minLength={3}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-gold"
                placeholder="hincha01"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-emerald-50">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
                type="password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-gold"
                placeholder="••••••••"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gold px-5 py-3 font-black text-slate-950 transition hover:bg-yellow-300 disabled:opacity-60"
            >
              {isSubmitting ? 'Conectando...' : isLogin ? 'Entrar al torneo' : 'Crear usuario'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(isLogin ? 'register' : 'login')
              setError(null)
            }}
            className="mt-5 w-full rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-emerald-50 transition hover:bg-white/10"
          >
            {isLogin ? 'No tengo cuenta, registrarme' : 'Ya tengo cuenta, iniciar sesion'}
          </button>
        </section>
      </div>
    </main>
  )
}
