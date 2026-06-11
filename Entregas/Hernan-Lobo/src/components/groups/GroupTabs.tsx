interface GroupTabsProps {
  groups: string[];
  selectedGroup: string | null;
  onSelect: (group: string | null) => void;
}

export function GroupTabs({ groups, selectedGroup, onSelect }: GroupTabsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          selectedGroup === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Todas
      </button>
      {groups.map((g) => (
        <button
          key={g}
          onClick={() => onSelect(g)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            selectedGroup === g
              ? 'bg-blue-600 text-white'
            : 'bg-black/50 text-gray-300 hover:bg-white/20'
          }`}
        >
          Grupo {g}
        </button>
      ))}
    </div>
  );
}
