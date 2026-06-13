// src/App.jsx
import React, { useState } from "react";
import { useAppContext } from "./context/AppContext";
import GroupTable from "./components/GroupTable";
import MatchCard from "./components/MatchCard";
import Scorers from "./components/Scorers";
import Bracket from "./components/Bracket";
import LandingPage from "./components/LandingPage";
import FixtureCard from "./components/FixtureCard";
import "./App.css";

const GRUPOS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

export default function App() {
  const { partidos, resetearDatos, simularTodo } = useAppContext();
  const [ingreso, setIngreso]           = useState(false);
  const [seccion, setSeccion]           = useState("grupos");
  const [grupoActivo, setGrupoActivo]   = useState("A");
  const [simulando, setSimulando]       = useState(false);

  if (!ingreso) return <LandingPage onIngresar={() => { setIngreso(true); setSeccion("nuevoFixture"); }} />;

  const partidosDelGrupo = partidos.filter(p => p.grupo === grupoActivo && p.fase === "Grupos");

  async function handleSimular() {
    if (!window.confirm("¿Simular todos los partidos pendientes?")) return;
    setSimulando(true);
    setTimeout(() => {
      simularTodo();
      setSimulando(false);
    }, 600);
  }

  return (
    <div className="app">
      <div className="app-sticky">
        <header className="app-header">
          <h1>⚽ Fixture Mundial 2026</h1>
          <div className="header-botones">
            <button className="btn-simular" onClick={handleSimular} disabled={simulando}>
              {simulando ? "Simulando..." : "🎲 Simular todo"}
            </button>
            <button className="btn-reset" onClick={() => {
              if (window.confirm("¿Borrar todos los resultados?")) resetearDatos();
            }}>
              Resetear
            </button>
          </div>
        </header>

        <nav className="nav-principal">
          {[
            { key: "grupos",       label: "Posiciones" },
            { key: "fixture",      label: "Partidos" },
            { key: "nuevoFixture", label: "Calendario" },
            { key: "eliminatoria", label: "Eliminatorias" },
            { key: "goleadores",   label: "Goleadores" },
          ].map(({ key, label }) => (
            <button key={key} className={seccion === key ? "activo" : ""} onClick={() => setSeccion(key)}>
              {label}
            </button>
          ))}
        </nav>
      </div>

      {seccion === "fixture" && (
        <div className="selector-grupos">
          {GRUPOS.map(g => (
            <button key={g} className={grupoActivo === g ? "activo" : ""} onClick={() => setGrupoActivo(g)}>{g}</button>
          ))}
        </div>
      )}

      <main className="contenido">
        {seccion === "grupos"       && (
          <div className="grupos-grid">
            {GRUPOS.map(g => <GroupTable key={g} grupo={g} />)}
          </div>
        )}
        {seccion === "fixture"      && (
          <div className="partidos-grid">
            {partidosDelGrupo.map(p => <MatchCard key={p.id} partido={p} />)}
          </div>
        )}
        {seccion === "nuevoFixture" && <FixtureCard />}
        {seccion === "eliminatoria" && <Bracket />}
        {seccion === "goleadores"   && <Scorers />}
      </main>
    </div>
  );
}