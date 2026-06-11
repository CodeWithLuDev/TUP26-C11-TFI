import { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { GroupSection } from '../components/groups/GroupSection';
import { GroupTabs } from '../components/groups/GroupTabs';
import type { GroupLetter } from '../types/team';

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function GroupsPage() {
  const { state } = useAppContext();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const visibleGroups = selectedGroup ? [selectedGroup] : groups;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Posiciones de Grupos</h2>
        <GroupTabs
          groups={groups}
          selectedGroup={selectedGroup}
          onSelect={setSelectedGroup}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleGroups.map((letter) => (
          <GroupSection
            key={letter}
            letter={letter}
            standings={state.standings[letter as GroupLetter]}
            teams={state.teams}
            matches={state.matches}
          />
        ))}
      </div>
    </div>
  );
}
