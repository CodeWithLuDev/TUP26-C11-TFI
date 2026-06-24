import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  message: string
  action?: ReactNode
}

export function LoadingState() {
  return (
    <div className="qatar-panel rounded-3xl p-8 text-center">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
      <p className="font-semibold text-white">Cargando datos del torneo...</p>
      <p className="mt-1 text-sm text-emerald-100/70">Consultando el backend existente.</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-3xl border border-red-300/30 bg-red-500/10 p-6 text-white">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-200">Error</p>
      <h3 className="mt-2 text-2xl font-black">No se pudo actualizar la informacion</h3>
      <p className="mt-2 text-red-50/80">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
        >
          Reintentar
        </button>
      ) : null}
    </div>
  )
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-gold/25 bg-white/[0.06] p-8 text-center">
      <p className="text-4xl">⚽</p>
      <h3 className="mt-3 text-xl font-black text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-emerald-50/70">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h2>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-emerald-50/70">{description}</p>
    </div>
  )
}
