import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { ApiError, api } from '../api/client'
import type { FixtureMatch, Player, SubmitResultPayload } from '../types/api'
import { formatMatchDate, roundLabels } from '../utils/format'
import { FlagBadge } from './ui/FlagBadge'

type ResultModalProps = {
  match: FixtureMatch
  token: string
  onClose: () => void
  onSubmit: (matchId: number, payload: SubmitResultPayload) => Promise<void>
}

export function ResultModal({ match, token, onClose, onSubmit }: ResultModalProps) {
  const [homeGoals, setHomeGoals] = useState<number | null>(match.user_result?.home_goals ?? null)
  const [awayGoals, setAwayGoals] = useState<number | null>(match.user_result?.away_goals ?? null)
  const [extraTime, setExtraTime] = useState(Boolean(match.user_result?.extra_time))
  const [penaltyWinner, setPenaltyWinner] = useState(match.user_result?.penalty_winner ?? '')
  const [homePlayers, setHomePlayers] = useState<Player[]>([])
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([])
  const [homeScorers, setHomeScorers] = useState<number[]>([])
  const [awayScorers, setAwayScorers] = useState<number[]>([])
  const [homeAssisters, setHomeAssisters] = useState<number[]>([])
  const [awayAssisters, setAwayAssisters] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const closeTimeouts = useRef<number[]>([])

  const isKnockout = match.round !== 'group'
  const hasScores = homeGoals !== null && awayGoals !== null
  const isDraw = hasScores && homeGoals === awayGoals
  const needsPenaltyWinner = isKnockout && isDraw
  const totalGoals = (homeGoals ?? 0) + (awayGoals ?? 0)

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    const scheduledCloseTimeouts = closeTimeouts.current
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
      scheduledCloseTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [])

  function schedule(callback: () => void, delay: number) {
    const timeoutId = window.setTimeout(callback, delay)
    closeTimeouts.current.push(timeoutId)
  }

  function closeWithAnimation() {
    if (isClosing) return
    setIsClosing(true)
    schedule(onClose, 220)
  }

  useEffect(() => {
    if (!match.home_team || !match.away_team) return

    void Promise.resolve()
      .then(() => {
        setIsLoadingPlayers(true)
        setError(null)
        return Promise.all([
          api.players(token, match.home_team!.id),
          api.players(token, match.away_team!.id),
        ])
      })
      .then(([home, away]) => {
        setHomePlayers(home)
        setAwayPlayers(away)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los jugadores')
      })
      .finally(() => setIsLoadingPlayers(false))
  }, [match.away_team, match.home_team, token])

  function handleHomeGoalsChange(value: number | null) {
    setHomeGoals(value)
    setHomeScorers((current) => resizeIds(current, value ?? 0))
    setHomeAssisters((current) => resizeIds(current, value ?? 0))
  }

  function handleAwayGoalsChange(value: number | null) {
    setAwayGoals(value)
    setAwayScorers((current) => resizeIds(current, value ?? 0))
    setAwayAssisters((current) => resizeIds(current, value ?? 0))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!match.home_team || !match.away_team) {
      setError('Los equipos del partido todavia no estan definidos.')
      return
    }

    if (homeGoals === null || awayGoals === null) {
      setError('Ingresa los goles de ambos equipos.')
      return
    }

    if (needsPenaltyWinner && !penaltyWinner) {
      setError('En eliminacion directa, un empate debe definir ganador por penales.')
      return
    }

    const scorerIds = [...homeScorers, ...awayScorers]
    if (scorerIds.some((playerId) => playerId <= 0)) {
      setError('Selecciona un goleador por cada gol cargado.')
      return
    }

    const goalEvents: SubmitResultPayload['goal_events'] = [
      ...scorerIds.map((playerId) => ({ player_id: playerId, event_type: 'goal' as const })),
      ...homeAssisters
        .filter((playerId) => playerId > 0)
        .map((playerId) => ({ player_id: playerId, event_type: 'assist' as const })),
      ...awayAssisters
        .filter((playerId) => playerId > 0)
        .map((playerId) => ({ player_id: playerId, event_type: 'assist' as const })),
    ]

    const payload: SubmitResultPayload = {
      home_goals: homeGoals,
      away_goals: awayGoals,
      extra_time: extraTime ? 1 : 0,
      penalties: needsPenaltyWinner ? 1 : 0,
      penalty_winner: needsPenaltyWinner ? penaltyWinner : null,
      goal_events: goalEvents,
    }

    setIsSubmitting(true)
    try {
      await onSubmit(match.id, payload)
      setIsSaved(true)
      schedule(closeWithAnimation, 520)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('No se pudo cargar el resultado')
      }
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div
      className={`result-modal-overlay fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-slate-950/80 px-4 py-4 backdrop-blur sm:py-6 ${
        isClosing ? 'result-modal-closing' : ''
      }`}
    >
      <div className="result-modal-card scrollbar-soft my-0 max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/15 bg-pitch-950 p-6 text-white shadow-card sm:max-h-[calc(100vh-3rem)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-gold">
              {roundLabels[match.round]}
            </p>
            <h3 className="mt-2 text-2xl font-black">
              {match.home_team?.name ?? match.home_source} vs{' '}
              {match.away_team?.name ?? match.away_source}
            </h3>
            <p className="mt-1 text-sm text-emerald-50/65">
              {formatMatchDate(match.scheduled_at_utc)} · {match.stadium ?? 'Sede a definir'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeWithAnimation}
            className="rounded-full border border-white/10 px-3 py-1 text-sm font-bold text-emerald-50 hover:bg-white/10"
          >
            Cerrar
          </button>
        </div>

        {match.user_result ? (
          <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm text-yellow-50">
            Este partido ya tiene resultado. Para modificarlo, borralo desde la tarjeta del
            fixture y cargalo nuevamente.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <TeamScore
              label={match.home_team?.name ?? 'Local'}
              flag={match.home_team?.flag_emoji}
              code={match.home_team?.code}
              value={homeGoals}
              disabled={Boolean(match.user_result)}
              onChange={handleHomeGoalsChange}
            />
            <span className="text-2xl font-black text-emerald-100/60">:</span>
            <TeamScore
              label={match.away_team?.name ?? 'Visitante'}
              flag={match.away_team?.flag_emoji}
              code={match.away_team?.code}
              value={awayGoals}
              disabled={Boolean(match.user_result)}
              onChange={handleAwayGoalsChange}
            />
          </div>

          {isLoadingPlayers ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-emerald-50/70">
              Cargando planteles...
            </p>
          ) : null}

          {!match.user_result && totalGoals > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <ScorerSelectors
                title={`Goles de ${match.home_team?.name ?? 'local'}`}
                players={homePlayers}
                values={homeScorers}
                onChange={setHomeScorers}
              />
              <ScorerSelectors
                title={`Goles de ${match.away_team?.name ?? 'visitante'}`}
                players={awayPlayers}
                values={awayScorers}
                onChange={setAwayScorers}
              />
            </div>
          ) : null}

          {!match.user_result && totalGoals > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <ScorerSelectors
                title={`Asistencias de ${match.home_team?.name ?? 'local'}`}
                players={homePlayers}
                values={homeAssisters}
                onChange={setHomeAssisters}
                optional
              />
              <ScorerSelectors
                title={`Asistencias de ${match.away_team?.name ?? 'visitante'}`}
                players={awayPlayers}
                values={awayAssisters}
                onChange={setAwayAssisters}
                optional
              />
            </div>
          ) : null}

          {!match.user_result && isKnockout ? (
            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
              <label className="flex items-center gap-3 text-sm font-bold text-emerald-50">
                <input
                  type="checkbox"
                  checked={extraTime}
                  onChange={(event) => setExtraTime(event.target.checked)}
                  className="h-5 w-5 rounded border-white/20 accent-emerald-400"
                />
                Definido en tiempo extra
              </label>
              {needsPenaltyWinner ? (
                <label className="block">
                  <span className="text-sm font-bold text-emerald-50">Ganador por penales</span>
                  <select
                    value={penaltyWinner}
                    onChange={(event) => setPenaltyWinner(event.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-gold"
                  >
                    <option value="">Seleccionar ganador</option>
                    {match.home_team ? (
                      <option value={match.home_team.code}>{match.home_team.name}</option>
                    ) : null}
                    {match.away_team ? (
                      <option value={match.away_team.code}>{match.away_team.name}</option>
                    ) : null}
                  </select>
                </label>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          {isSaved ? (
            <div className="result-modal-success rounded-2xl border border-emerald-300/35 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100">
              Resultado confirmado. Actualizando el fixture...
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeWithAnimation}
              disabled={isSubmitting}
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-emerald-50 hover:bg-white/10 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={Boolean(match.user_result) || isSubmitting || isLoadingPlayers}
              className="rounded-2xl bg-gold px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-yellow-300 disabled:opacity-60"
            >
              {isSaved ? 'Confirmado' : isSubmitting ? 'Guardando...' : 'Confirmar resultado'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}

function TeamScore({
  label,
  flag,
  code,
  value,
  disabled,
  onChange,
}: {
  label: string
  flag?: string
  code?: string
  value: number | null
  disabled: boolean
  onChange: (value: number | null) => void
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <span className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-50/75">
        <FlagBadge code={code} emoji={flag} label={label} className="h-8 w-8 rounded-xl" />
        <span className="truncate">{label}</span>
      </span>
      <input
        type="number"
        min={0}
        value={value ?? ''}
        placeholder="-"
        disabled={disabled}
        onChange={(event) => {
          const rawValue = event.target.value
          onChange(rawValue === '' ? null : Math.max(0, Number(rawValue)))
        }}
        className="score-input mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-center text-4xl font-black text-white outline-none placeholder:text-emerald-100/35 focus:border-gold disabled:opacity-60"
      />
    </label>
  )
}

function ScorerSelectors({
  title,
  players,
  values,
  optional = false,
  onChange,
}: {
  title: string
  players: Player[]
  values: number[]
  optional?: boolean
  onChange: (values: number[]) => void
}) {
  if (values.length === 0) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h4 className="font-black text-white">{title}</h4>
      <div className="mt-3 space-y-3">
        {values.map((value, index) => (
          <select
            key={`${title}-${index}`}
            value={value}
            onChange={(event) => {
              const next = [...values]
              next[index] = Number(event.target.value)
              onChange(next)
            }}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-gold"
            required={!optional}
          >
            <option value={0}>{optional ? `Sin asistencia #${index + 1}` : `Gol #${index + 1}`}</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                #{player.number} {player.name}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  )
}

function resizeIds(current: number[], size: number) {
  if (size <= 0) return []
  return Array.from({ length: size }, (_, index) => current[index] ?? 0)
}
