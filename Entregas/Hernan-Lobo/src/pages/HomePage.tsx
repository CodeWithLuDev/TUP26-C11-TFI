import { TeamList } from '../components/teams/TeamList';
import { DevTools } from '../components/dev/DevTools';

export function HomePage() {
  return (
    <div>
      <DevTools />
      <h2 className="text-2xl font-bold text-white mb-6">Equipos</h2>
      <TeamList />
    </div>
  );
}
