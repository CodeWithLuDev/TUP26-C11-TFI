import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { Team } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';

interface ChampionCelebrationModalProps {
  championTeam: Team;
  onViewStats: () => void;
  onClose: () => void;
}

// Configuración de los fuegos artificiales
const FIREWORK_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF69B4', '#00FF88', '#FFE66D', '#FF4500', '#00BFFF'];
const FIREWORK_POSITIONS = [12, 30, 50, 70, 88];
const PARTICLE_COUNT = 12;

type Particle = { angle: number; dist: number; color: string };
type Firework = { left: number; delay: number; duration: number; particles: Particle[] };

/** Genera partículas con posiciones y colores aleatorios para cada fuego artificial */
function buildFireworks(): Firework[] {
  return FIREWORK_POSITIONS.map((left, fi) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * 360;
      const dist = 60 + Math.random() * 100;
      particles.push({
        angle,
        dist,
        color: FIREWORK_COLORS[(fi + i) % FIREWORK_COLORS.length],
      });
    }
    return {
      left,
      delay: fi * 0.7,
      duration: 1.5 + Math.random() * 0.5,
      particles,
    };
  });
}

export function ChampionCelebrationModal({ championTeam, onViewStats, onClose }: ChampionCelebrationModalProps) {
  // Cierra con Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // useMemo para que los fuegos artificiales no se regeneren en cada render
  const fireworks = useMemo(() => buildFireworks(), []);

  // createPortal para renderizar sobre todo el árbol de componentes
  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
      {/* Capa de fuegos artificiales con animaciones CSS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {fireworks.map((fw) => (
          <div
            key={fw.left}
            className="absolute bottom-4"
            style={{
              left: `${fw.left}%`,
              animation: `firework-launch ${fw.duration}s ease-out ${fw.delay}s both`,
            }}
          >
            {fw.particles.map((p, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: p.color,
                  animation: `firework-particle 1s ease-out ${fw.delay + 0.1 + i * 0.02}s both`,
                  // Variables CSS personalizadas para la dirección de cada partícula
                  '--tx': `${Math.cos((p.angle * Math.PI) / 180) * p.dist}px`,
                  '--ty': `${Math.sin((p.angle * Math.PI) / 180) * p.dist}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Contenido principal con animaciones escalonadas */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        <div className="animate-bounce-in">
          <img
            src="/imagenes/trofeo.png"
            alt="Copa Mundial"
            className="w-25 h-24 md:w-60 md:h-60 mx-auto mb-4 object-contain animate-bounce-in"
          />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' } as React.CSSProperties}>
          <div className="flex items-center justify-center gap-3 mb-3 mt-4">
            <FlagIcon countryCode={championTeam.flag} size="lg" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
            {championTeam.name}
          </h2>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '1s' } as React.CSSProperties}>
          <p className="text-xl sm:text-2xl text-yellow-400 font-bold mt-4 mb-10 drop-shadow-lg">
            🏆 Campeón del Mundo Qatar 2022
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '1.4s' } as React.CSSProperties}>
          <button
            onClick={onViewStats}
            className="px-8 py-3 bg-linear-to-r from-yellow-500 to-amber-600 text-white font-bold rounded-full shadow-lg hover:shadow-yellow-500/30 hover:scale-105 active:scale-95 transition-all duration-300 text-base sm:text-lg"
          >
            Ver estadísticas de la Final
          </button>
        </div>
      </div>

      {/* Keyframes de animaciones inline para evitar dependencias externas */}
      <style>{`
        @keyframes firework-launch {
          0% { transform: translateX(-50%) translateY(0); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-350px); opacity: 0; }
        }
        @keyframes firework-particle {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-in { animation: bounce-in 0.8s ease-out both; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
      `}</style>
    </div>,
    document.body
  );
}
