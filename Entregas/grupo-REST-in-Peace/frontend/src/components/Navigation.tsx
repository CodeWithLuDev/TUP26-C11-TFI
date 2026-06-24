import { cx } from '../utils/format'

export type View = 'home' | 'fixture' | 'groups' | 'bracket' | 'stats'

const navItems: Array<{ id: View; label: string }> = [
  { id: 'home', label: 'Equipos' },
  { id: 'fixture', label: 'Fixture' },
  { id: 'groups', label: 'Grupos' },
  { id: 'bracket', label: 'Playoffs' },
  { id: 'stats', label: 'Estadisticas' },
]

export function Navigation({
  activeView,
  onChange,
}: {
  activeView: View
  onChange: (view: View) => void
}) {
  return (
    <nav className="scrollbar-soft flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-slate-950/45 p-1 backdrop-blur">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cx(
            'whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition',
            activeView === item.id
              ? 'bg-white text-pitch-950 shadow-lg'
              : 'text-emerald-50/70 hover:bg-white/10 hover:text-white',
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
