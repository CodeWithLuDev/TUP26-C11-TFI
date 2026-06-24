import { useState } from 'react'
import { getFlagUrl } from '../../utils/countryFlags'
import { cx } from '../../utils/format'

export function FlagBadge({
  code,
  emoji,
  label,
  className,
}: {
  code?: string
  emoji?: string
  label: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const flagUrl = getFlagUrl(code)

  return (
    <span
      className={cx(
        'flag-badge flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
        className,
      )}
      title={label}
    >
      {flagUrl && !failed ? (
        <img src={flagUrl} alt={`Bandera de ${label}`} onError={() => setFailed(true)} />
      ) : (
        <span className="flag-badge-fallback">{emoji || code?.slice(0, 2) || '•'}</span>
      )}
    </span>
  )
}
