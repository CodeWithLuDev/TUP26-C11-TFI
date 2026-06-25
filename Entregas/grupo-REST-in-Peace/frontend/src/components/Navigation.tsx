import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { cx } from '../utils/format'

export type View = 'home' | 'fixture' | 'groups' | 'bracket' | 'stats'

type NavItem = {
  id: View
  label: string
  Icon: (props: { className?: string }) => ReactElement
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  )
}

function TeamsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3.5 19c.8-3 3.4-5 5.5-5s4.7 2 5.5 5" />
      <path d="M14.5 17c.6-2 2.2-3.5 4-3.5 1.4 0 2.7.8 3.5 2.5" />
    </svg>
  )
}

function FixtureIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  )
}

function BracketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 6h4v4H9a3 3 0 0 0 0 6h0v4H5v-4h0a3 3 0 0 0 0-6h0V6Z" />
      <path d="M15 6h4v4h0a3 3 0 0 1 0 6h0v4h-4v-4h0a3 3 0 0 1 0-6h0V6Z" />
      <path d="M11 12h2" />
    </svg>
  )
}

function StatsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 19V9M12 19V5M19 19v-7" />
    </svg>
  )
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M20 12a8 8 0 1 1-2.3-5.7" />
      <path d="M20 4v6h-6" />
    </svg>
  )
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Inicio', Icon: HomeIcon },
  { id: 'groups', label: 'Grupos', Icon: TeamsIcon },
  { id: 'fixture', label: 'Partidos', Icon: FixtureIcon },
  { id: 'bracket', label: 'Playoffs', Icon: BracketIcon },
  { id: 'stats', label: 'Info', Icon: StatsIcon },
]

function NavButton({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active: boolean
  onClick: () => void
}) {
  const { Icon } = item

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cx(
        'inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-black transition',
        active
          ? 'bg-white/12 text-white shadow-inner ring-1 ring-gold/35'
          : 'text-emerald-50/78 hover:bg-white/10 hover:text-white',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </button>
  )
}

export function DesktopNavigation({
  activeView,
  onChange,
}: {
  activeView: View
  onChange: (view: View) => void
}) {
  return (
    <nav
      aria-label="Secciones del torneo"
      className="scrollbar-soft flex gap-1 overflow-x-auto rounded-xl border border-white/5 bg-black/10 p-1 backdrop-blur"
    >
      {navItems.map((item) => (
        <NavButton
          key={item.id}
          item={item}
          active={activeView === item.id}
          onClick={() => onChange(item.id)}
        />
      ))}
    </nav>
  )
}

export function MobileMenu({
  activeView,
  onChange,
  onRefresh,
  onLogout,
}: {
  activeView: View
  onChange: (view: View) => void
  onRefresh: () => void
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  function selectView(view: View) {
    onChange(view)
    setOpen(false)
  }

  function handleRefresh() {
    onRefresh()
    setOpen(false)
  }

  function handleLogout() {
    onLogout()
    setOpen(false)
  }

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={open ? 'Cerrar menu' : 'Abrir menu de navegacion'}
        className={cx(
          'inline-flex items-center justify-center rounded-xl border px-3 py-2 transition',
          open
            ? 'border-gold/50 bg-gold/15 text-gold'
            : 'border-gold/35 text-emerald-50 hover:bg-gold/10 hover:text-white',
        )}
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Cerrar menu"
            className="mobile-menu-backdrop fixed inset-0 z-40 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="mobile-menu-panel absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 overflow-hidden rounded-2xl p-1.5"
          >
            {navItems.map((item) => {
              const { Icon } = item
              const active = activeView === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => selectView(item.id)}
                  className={cx(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black transition',
                    active
                      ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
                      : 'text-emerald-50 hover:bg-white/8 hover:text-white',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              )
            })}

            <div className="my-1.5 border-t border-gold/20" />

            <button
              type="button"
              role="menuitem"
              onClick={handleRefresh}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black text-emerald-50 transition hover:bg-white/8 hover:text-white"
            >
              <RefreshIcon className="h-4 w-4 shrink-0" />
              Actualizar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl bg-gold/90 px-3 py-3 text-left text-sm font-black text-pitch-950 transition hover:bg-emerald-50"
            >
              <LogoutIcon className="h-4 w-4 shrink-0" />
              Salir
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}
