import { useState } from 'react';
import type { Player } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';

interface PlayerCardProps {
  player: Player;
  flagCode: string;
}

const positionLabels: Record<Player['position'], string> = {
  Goalkeeper: 'Arquero',
  Defender: 'Defensor',
  Midfielder: 'Mediocampista',
  Forward: 'Delantero',
};

export function PlayerCard({ player, flagCode }: PlayerCardProps) {
  const [imgError, setImgError] = useState(false);

  const showFallback = !player.picture || imgError;

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-white/5 flex items-center justify-center p-4">
        {showFallback ? (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <FlagIcon countryCode={flagCode} size="lg" />
          </div>
        ) : (
          <img
            src={player.picture}
            alt={player.name}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-3 flex flex-col items-center text-center gap-1">
        <span className="text-lg font-bold text-white leading-none">#{player.jerseyNum}</span>
        <span className="font-semibold text-gray-100 text-sm leading-tight">{player.name}</span>
        <span className="text-xs text-gray-400">{positionLabels[player.position]}</span>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <span>{player.age} años</span>
          <span>·</span>
          <span>{player.height} cm</span>
          <span>·</span>
          <span>{player.weight} kg</span>
        </div>
      </div>
    </div>
  );
}
