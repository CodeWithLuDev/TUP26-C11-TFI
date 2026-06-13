import { NavLink } from 'react-router-dom';

const links = [
  { to: '/home', label: 'Equipos' },
  { to: '/groups', label: 'Grupos' },
  { to: '/fixture', label: 'Fixture' },
  { to: '/playoffs', label: 'Playoffs' },
  { to: '/stats', label: 'Estadísticas' },
];

export function Navbar() {
  return (
    <nav className="bg-black/40 backdrop-blur border-b border-white/20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 overflow-x-auto">
        <ul className="flex gap-1 whitespace-nowrap">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/home'}
                className={({ isActive }) =>
                  `inline-block px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
