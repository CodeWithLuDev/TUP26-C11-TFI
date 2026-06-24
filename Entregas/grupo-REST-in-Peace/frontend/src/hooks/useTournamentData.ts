import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type {
  BracketResponse,
  FixtureMatch,
  RankedAssister,
  RankedScorer,
  Session,
  StandingsResponse,
  SubmitResultPayload,
  Team,
} from '../types/api'

type TournamentData = {
  teams: Team[]
  fixture: FixtureMatch[]
  standings: StandingsResponse | null
  bracket: BracketResponse | null
  scorers: RankedScorer[]
  assisters: RankedAssister[]
}

const emptyData: TournamentData = {
  teams: [],
  fixture: [],
  standings: null,
  bracket: null,
  scorers: [],
  assisters: [],
}

export function useTournamentData(session: Session | null) {
  const [data, setData] = useState<TournamentData>(emptyData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!session) return

    setIsLoading(true)
    setError(null)

    try {
      const [teams, fixture, standings, bracket, scorersResponse, assistersResponse] =
        await Promise.all([
          api.teams(session.token),
          api.fixture(session.token),
          api.standings(session.token),
          api.bracket(session.token),
          api.scorers(session.token),
          api.assisters(session.token),
        ])

      setData({
        teams,
        fixture,
        standings,
        bracket,
        scorers: scorersResponse.scorers,
        assisters: assistersResponse.assisters,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (session) {
      void refresh()
    } else {
      setData(emptyData)
    }
  }, [refresh, session])

  const submitResult = useCallback(
    async (matchId: number, payload: SubmitResultPayload) => {
      if (!session) return
      await api.submitResult(session.token, matchId, payload)
      await refresh()
    },
    [refresh, session],
  )

  const deleteResult = useCallback(
    async (matchId: number) => {
      if (!session) return
      await api.deleteResult(session.token, matchId)
      await refresh()
    },
    [refresh, session],
  )

  return {
    ...data,
    isLoading,
    error,
    refresh,
    submitResult,
    deleteResult,
  }
}
