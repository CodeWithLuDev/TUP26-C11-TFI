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
import logoMundial from "./imagen/mundial_2026.png";
import pelota from "./imagen/pelota.png";

const GRUPOS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

const tarjetasInfo = [
  { icono: "🌍", titulo: "48 Selecciones", texto: "Por primera vez en la historia, 48 equipos competirán por la gloria mundial, aumentando desde las 32 tradicionales." },
  { icono: "🏟️", titulo: "16 Ciudades Sede", texto: "Tres países anfitriones con 16 estadios de clase mundial distribuidos en Estados Unidos, Canadá y México." },
  { icono: "⚽", titulo: "104 Partidos", texto: "El torneo más largo de la historia con 104 encuentros a lo largo de 39 días de competencia." },
  { icono: "🏆", titulo: "Nuevo Formato", texto: "12 grupos de 4 equipos, con los dos primeros y los 8 mejores terceros avanzando a octavos de final." },
  { icono: "📅", titulo: "11 Jun - 19 Jul", texto: "El torneo se disputará en verano, con la final programada para el 19 de julio en el MetLife Stadium." },
  { icono: "🌎", titulo: "Tres Naciones", texto: "Primera vez que tres países organizan conjuntamente una Copa del Mundo FIFA." },
];

export default function App() {
  const { partidos, resetearDatos, simularTodo } = useAppContext();
  const [ingreso, setIngreso]           = useState(false);
  const [seccion, setSeccion]           = useState("grupos");
  const [grupoActivo, setGrupoActivo]   = useState("A");
  const [simulando, setSimulando]       = useState(false);

  if (!ingreso) return <LandingPage onIngresar={() => { setIngreso(true); setSeccion("informacion"); }} />;

  const partidosDelGrupo = partidos.filter(p => p.grupo === grupoActivo && p.fase === "Grupos");

  async function handleSimular() {
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
          <h1><img src={logoMundial} alt="Logo" style={{ height: 100, marginRight: 10, verticalAlign: "middle" }} />Mundial 2026</h1>
        </header>

        <nav className="nav-principal">
          {[
            { key: "grupos",       label: "Posiciones" },
            { key: "fixture",      label: "Partidos" },
            { key: "nuevoFixture", label: "Calendario" },
            { key: "eliminatoria", label: "Eliminatorias" },
            { key: "goleadores",   label: "Goleadores" },
            { key: "informacion",  label: "Información" },
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
        {seccion === "informacion"  && (
          <section className="historia-section">
            <h2 className="historia-titulo">Un Mundial Histórico</h2>
            <div className="historia-grid">
              {tarjetasInfo.map((t, i) => (
                <div key={i} className="historia-card">
                  <div className="historia-icono">{t.icono}</div>
                  <h3 className="historia-card-titulo">{t.titulo}</h3>
                  <p className="historia-card-texto">{t.texto}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="app-footer-botones">
        <button className="btn-simular" onClick={handleSimular} disabled={simulando}>
          {simulando ? "Simulando..." : <><img src={pelota} alt="" className="btn-icono-pelota" /> Simular partido</>}
        </button>
        <button className="btn-reset" onClick={() => {
          resetearDatos();
        }}>
          Resetear
        </button>
      </div>
    </div>
  );
}