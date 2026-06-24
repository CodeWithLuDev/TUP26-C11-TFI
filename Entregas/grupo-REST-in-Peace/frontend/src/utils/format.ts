import type { Round } from '../types/api'

export const roundLabels: Record<Round, string> = {
  group: 'Fase de grupos',
  R16: 'Octavos',
  QF: 'Cuartos',
  SF: 'Semifinales',
  '3rd': 'Tercer puesto',
  final: 'Final',
}

export const knockoutRounds: Array<Exclude<Round, 'group'>> = ['R16', 'QF', 'SF', '3rd', 'final']

export function formatMatchDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function getTimezoneLabel() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'zona horaria local'
}

export function groupBy<T, K extends string | number>(items: T[], getKey: (item: T) => K) {
  return items.reduce<Record<K, T[]>>(
    (acc, item) => {
      const key = getKey(item)
      acc[key] = [...(acc[key] ?? []), item]
      return acc
    },
    {} as Record<K, T[]>,
  )
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
