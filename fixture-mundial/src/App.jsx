
import React, { useState } from "react";
import { useAppContext } from "./context/AppContext";
import GroupTable from "./components/GroupTable";
import MatchCard from "./components/MatchCard";
import "./App.css";

const GRUPOS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
const FASES  = ["Grupos", "Octavos", "Cuartos", "Semis", "Final"];

export default function App() {
  const { partidos, resetearDatos } = useAppContext();

  // Estado local para navegación
  const [seccion, setSeccion]     = useState("grupos");   // "grupos" | "fixture" | "eliminatoria"
  const [grupoActivo, setGrupoActivo] = useState("A");
  const [faseActiva, setFaseActiva]   = useState("Octavos");

  // Filtrar partidos según la vista activa
  const partidosDelGrupo = partidos.filter(
    p => p.grupo === grupoActivo && p.fase === "Grupos"
  );
  const partidosDeFase = partidos.filter(p => p.fase === faseActiva);

  return (
    <div className="app">

      {/* ===== HEADER ===== */}
      <header className="app-header">
        <h1>⚽ Fixture Mundial 2026</h1>
        <button
          className="btn-reset"
          onClick={() => {
            if (window.confirm("¿Seguro que querés borrar todos los resultados?")) {
              resetearDatos();
            }
          }}
        >
          Resetear datos
        </button>
      </header>

      {/* ===== NAVEGACIÓN PRINCIPAL ===== */}
      <nav className="nav-principal">
        <button
          className={seccion === "grupos" ? "activo" : ""}
          onClick={() => setSeccion("grupos")}
        >
          Posiciones
        </button>
        <button
          className={seccion === "fixture" ? "activo" : ""}
          onClick={() => setSeccion("fixture")}
        >
          Fixture Grupos
        </button>
        <button
          className={seccion === "eliminatoria" ? "activo" : ""}
          onClick={() => setSeccion("eliminatoria")}
        >
          Eliminatorias
        </button>
      </nav>

      {/* ===== SELECTOR DE GRUPO ===== */}
      {(seccion === "grupos" || seccion === "fixture") && (
        <div className="selector-grupos">
          {GRUPOS.map(g => (
            <button
              key={g}
              className={grupoActivo === g ? "activo" : ""}
              onClick={() => setGrupoActivo(g)}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* ===== SELECTOR DE FASE ELIMINATORIA ===== */}
      {seccion === "eliminatoria" && (
        <div className="selector-grupos">
          {FASES.filter(f => f !== "Grupos").map(f => (
            <button
              key={f}
              className={faseActiva === f ? "activo" : ""}
              onClick={() => setFaseActiva(f)}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <main className="contenido">

        {/* Vista: Tabla de posiciones */}
        {seccion === "grupos" && (
          <GroupTable grupo={grupoActivo} />
        )}

        {/* Vista: Fixture de grupos */}
        {seccion === "fixture" && (
          <div className="partidos-grid">
            {partidosDelGrupo.map(partido => (
              <MatchCard key={partido.id} partido={partido} />
            ))}
          </div>
        )}

        {/* Vista: Fase eliminatoria */}
        {seccion === "eliminatoria" && (
          <div className="partidos-grid">
            {partidosDeFase.map(partido => (
              <MatchCard key={partido.id} partido={partido} />
            ))}
          </div>
        )}

      </main>

    </div>
  );
}