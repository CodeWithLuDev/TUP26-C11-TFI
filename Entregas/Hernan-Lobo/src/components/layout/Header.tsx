export function Header() {
  return (
    <header className="bg-black/40 backdrop-blur text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 flex items-center gap-3">
        <span className="text-2xl">
          <img
            src="/imagenes/icono_inicio.png"
            alt="Icono del header"
            className="w-8 h-8 object-contain"
          />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Mundial 2022</h1>
          <p className="text-gray-300 text-xs">Gestor de Fixture</p>
        </div>
      </div>
    </header>
  );
}
