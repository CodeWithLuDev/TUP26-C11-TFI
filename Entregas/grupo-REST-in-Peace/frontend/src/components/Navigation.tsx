import { cx } from '../utils/format'

export type View = 'home' | 'fixture' | 'groups' | 'bracket' | 'stats'

const navItems: Array<{ id: View; label: string }> = [
  { id: 'home', label: 'Inicio' },
  { id: 'groups', label: 'Equipos' },
  { id: 'fixture', label: 'Partidos' },
  { id: 'bracket', label: 'Playoffs' },
  { id: 'stats', label: 'Info' },
]

export function Navigation({
  activeView,
  onChange,
}: {
  activeView: View
  onChange: (view: View) => void
}) {
  return (
    <nav className="scrollbar-soft flex gap-1 overflow-x-auto rounded-xl border border-white/5 bg-black/10 p-1 backdrop-blur">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cx(
            'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-black transition',
            activeView === item.id
              ? 'bg-white/12 text-white shadow-inner ring-1 ring-gold/35'
              : 'text-emerald-50/78 hover:bg-white/10 hover:text-white',
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
