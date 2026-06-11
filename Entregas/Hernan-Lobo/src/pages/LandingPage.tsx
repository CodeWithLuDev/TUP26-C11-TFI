import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute left-0 top-0 h-full w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/imagenes/inicio.jpg')" }}
        />

        <div
          className="absolute right-0 top-0 h-full w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/imagenes/inicio.jpg')" }}
        />
      </div>

      <div className="animate-fade-in flex flex-col items-center px-6 text-center -mt-30">
        <img
          src="/imagenes/trofeo.png"
          alt="Copa Mundial Qatar 2022"
          className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 object-contain"
        />

        <div className="animate-slide-up">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
            Mundial 2022
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 font-light mb-6">
            Qatar <span className="inline-block animate-bounce-slow">⚽</span>
          </p>
          <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm sm:text-base leading-relaxed">
            Gestioná los resultados, seguí las posiciones de cada grupo,
            explorá el fixture y viví la emoción de la fase eliminatoria
            del Mundial de Fútbol.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="px-10 py-3.5 bg-linear-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-full text-base shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transition-all duration-300 active:scale-95"
          >
            Ingresar al torneo
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 1s ease-out 0.3s both; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
