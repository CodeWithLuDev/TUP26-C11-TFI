import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, api } from '../api/client'
import type { FixtureMatch, Player, SubmitResultPayload } from '../types/api'
import { formatMatchDate, roundLabels } from '../utils/format'

type ResultModalProps = {
  match: FixtureMatch
  token: string
  onClose: () => void
  onSubmit: (matchId: number, payload: SubmitResultPayload) => Promise<void>
}

export function ResultModal({ match, token, onClose, onSubmit }: ResultModalProps) {
  const [homeGoals, setHomeGoals] = useState(match.user_result?.home_goals ?? 0)
  const [awayGoals, setAwayGoals] = useState(match.user_result?.away_goals ?? 0)
  const [extraTime, setExtraTime] = useState(Boolean(match.user_result?.extra_time))
  const [penaltyWinner, setPenaltyWinner] = useState(match.user_result?.penalty_winner ?? '')
  const [homePlayers, setHomePlayers] = useState<Player[]>([])
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([])
  const [homeScorers, setHomeScorers] = useState<number[]>([])
  const [awayScorers, setAwayScorers] = useState<number[]>([])
  const [assisters, setAssisters] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allPlayers = useMemo(() => [...homePlayers, ...awayPlayers], [awayPlayers, homePlayers])
  const isKnockout = match.round !== 'group'
  const isDraw = homeGoals === awayGoals
  const needsPenaltyWinner = isKnockout && isDraw
  const totalGoals = homeGoals + awayGoals

  useEffect(() => {
    if (!match.home_team || !match.away_team) return

    setIsLoadingPlayers(true)
    setError(null)
    void Promise.all([
      api.players(token, match.home_team.id),
      api.players(token, match.away_team.id),
    ])
      .then(([home, away]) => {
        setHomePlayers(home)
        setAwayPlayers(away)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los jugadores')
      })
      .finally(() => setIsLoadingPlayers(false))
  }, [match.away_team, match.home_team, token])

  useEffect(() => {
    setHomeScorers((current) => resizeIds(current, homeGoals))
  }, [homeGoals])

  useEffect(() => {
    setAwayScorers((current) => resizeIds(current, awayGoals))
  }, [awayGoals])

  useEffect(() => {
    setAssisters((current) => resizeIds(current, totalGoals))
  }, [totalGoals])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!match.home_team || !match.away_team) {
      setError('Los equipos del partido todavia no estan definidos.')
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
      ...assisters
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
      onClose()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('No se pudo cargar el resultado')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur">
      <div className="scrollbar-soft max-h-full w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/15 bg-pitch-950 p-6 text-white shadow-card">
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
            onClick={onClose}
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
              value={homeGoals}
              disabled={Boolean(match.user_result)}
              onChange={setHomeGoals}
            />
            <span className="text-2xl font-black text-emerald-100/60">:</span>
            <TeamScore
              label={match.away_team?.name ?? 'Visitante'}
              flag={match.away_team?.flag_emoji}
              value={awayGoals}
              disabled={Boolean(match.user_result)}
              onChange={setAwayGoals}
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
            <ScorerSelectors
              title="Asistencias opcionales"
              players={allPlayers}
              values={assisters}
              onChange={setAssisters}
              optional
            />
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

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-emerald-50 hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={Boolean(match.user_result) || isSubmitting || isLoadingPlayers}
              className="rounded-2xl bg-gold px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-yellow-300 disabled:opacity-60"
            >
              {isSubmitting ? 'Guardando...' : 'Confirmar resultado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TeamScore({
  label,
  flag,
  value,
  disabled,
  onChange,
}: {
  label: string
  flag?: string
  value: number
  disabled: boolean
  onChange: (value: number) => void
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <span className="block truncate text-sm font-bold text-emerald-50/75">
        {flag ? `${flag} ` : ''}
        {label}
      </span>
      <input
        type="number"
        min={0}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
        className="score-input mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-center text-4xl font-black text-white outline-none focus:border-gold disabled:opacity-60"
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
