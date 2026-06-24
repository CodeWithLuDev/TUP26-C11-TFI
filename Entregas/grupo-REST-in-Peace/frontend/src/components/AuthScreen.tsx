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
    <main className="auth-login-screen flex min-h-screen items-center px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
        <section className="flex items-center justify-center px-3 py-4 text-center lg:justify-start">
          <div className="relative flex w-full max-w-lg justify-center lg:justify-start">
            <img
              src="/qatar-2022-logo-transparent.png"
              alt="FIFA World Cup Qatar 2022"
              className="auth-logo-hero h-auto w-full max-w-[14rem] object-contain sm:max-w-[17rem] lg:max-w-[22rem]"
            />
          </div>
        </section>

        <section className="qatar-panel mx-auto w-full max-w-md rounded-[1.75rem] p-5 shadow-[0_28px_90px_rgba(19,3,9,0.48)] sm:p-7">
          <div className="mb-6 text-left">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">
              {isLogin ? 'Ingresar' : 'Crear cuenta'}
            </p>
            <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
              {isLogin ? 'Bienvenido' : 'Nuevo hincha'}
            </h2>
            <p className="mt-2 text-sm text-emerald-50/70">
              Accede y segui tu progreso donde lo dejaste.
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
                className="mt-2 w-full rounded-2xl border border-white/10 bg-pitch-950/60 px-4 py-3.5 text-white outline-none transition placeholder:text-white/30 focus:border-gold focus:bg-pitch-950/80"
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
                className="mt-2 w-full rounded-2xl border border-white/10 bg-pitch-950/60 px-4 py-3.5 text-white outline-none transition placeholder:text-white/30 focus:border-gold focus:bg-pitch-950/80"
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
              className="w-full rounded-2xl bg-gold px-5 py-3.5 font-black text-pitch-950 shadow-lg shadow-gold/10 transition hover:-translate-y-0.5 hover:bg-emerald-50 disabled:opacity-60"
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
            className="mt-4 w-full rounded-2xl border border-gold/20 px-5 py-3.5 text-sm font-bold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            {isLogin ? 'No tengo cuenta, registrarme' : 'Ya tengo cuenta, iniciar sesion'}
          </button>
        </section>
      </div>
    </main>
  )
}
