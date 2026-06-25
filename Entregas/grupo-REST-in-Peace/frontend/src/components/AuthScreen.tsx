import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, api, storeSession } from '../api/client'
import type { Session } from '../types/api'

const inputClassName =
  'auth-input w-full rounded-2xl border border-white/10 bg-pitch-950/60 px-4 py-3.5 text-white outline-none transition focus:border-gold focus:bg-pitch-950/80'

const passwordInputClassName = `${inputClassName} pr-12`

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.2 18.2 0 0 1-4.1 5.2" />
      <path d="M6.1 6.1C3.5 8.1 2 12 2 12s3.5 7 10 7a10.7 10.7 0 0 0 4.2-.9" />
    </svg>
  )
}

type PasswordFieldProps = {
  id: string
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  enterKeyHint?: 'next' | 'go'
  showPassword: boolean
  onToggleShow: () => void
}

function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete,
  enterKeyHint,
  showPassword,
  onToggleShow,
}: PasswordFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-bold text-emerald-50">{label}</span>
      <div className="relative mt-2">
        <input
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          minLength={6}
          required
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          enterKeyHint={enterKeyHint}
          className={passwordInputClassName}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="auth-password-toggle absolute inset-y-0 right-0 flex w-12 items-center justify-center text-emerald-50/70 transition hover:text-gold"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={showPassword}
        >
          <EyeIcon open={showPassword} />
        </button>
      </div>
    </label>
  )
}

export function AuthScreen({ onAuthenticated }: { onAuthenticated: (session: Session) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const trimmedUsername = username.trim()
  const isLogin = mode === 'login'

  const canSubmit = useMemo(() => {
    if (trimmedUsername.length < 3 || password.length < 6) return false
    if (isLogin) return true
    return confirmPassword.length >= 6 && password === confirmPassword
  }, [confirmPassword, isLogin, password, trimmedUsername])

  const passwordsMismatch =
    !isLogin && confirmPassword.length > 0 && password !== confirmPassword

  function switchMode(nextMode: 'login' | 'register') {
    setMode(nextMode)
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    setError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    setError(null)
    setIsSubmitting(true)

    try {
      const session =
        mode === 'login'
          ? await api.login(trimmedUsername, password)
          : await api.register(trimmedUsername, password)
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
              {isLogin
                ? 'Accede y segui tu progreso donde lo dejaste.'
                : 'Crea tu cuenta y empeza a cargar resultados del Mundial.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <label className="block" htmlFor="auth-username">
              <span className="text-sm font-bold text-emerald-50">Usuario</span>
              <input
                id="auth-username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                minLength={3}
                required
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                className={`${inputClassName} mt-2`}
              />
            </label>

            <PasswordField
              id="auth-password"
              name="password"
              label="Contraseña"
              value={password}
              onChange={setPassword}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              enterKeyHint={isLogin ? 'go' : 'next'}
              showPassword={showPassword}
              onToggleShow={() => setShowPassword((current) => !current)}
            />

            {!isLogin ? (
              <PasswordField
                id="auth-confirm-password"
                name="confirmPassword"
                label="Confirmar contraseña"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
                enterKeyHint="go"
                showPassword={showConfirmPassword}
                onToggleShow={() => setShowConfirmPassword((current) => !current)}
              />
            ) : null}

            {passwordsMismatch ? (
              <div className="rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                Las contraseñas no coinciden.
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full rounded-2xl bg-gold px-5 py-3.5 font-black text-pitch-950 shadow-lg shadow-gold/10 transition hover:-translate-y-0.5 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Conectando...' : isLogin ? 'Entrar al torneo' : 'Crear usuario'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => switchMode(isLogin ? 'register' : 'login')}
            className="mt-4 w-full rounded-2xl border border-gold/20 px-5 py-3.5 text-sm font-bold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            {isLogin ? 'No tengo cuenta, registrarme' : 'Ya tengo cuenta, iniciar sesion'}
          </button>
        </section>
      </div>
    </main>
  )
}
