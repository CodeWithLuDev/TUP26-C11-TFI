// =============================================
// COMPONENTE SCORERS — Tabla de Goleadores
// src/components/Scorers.jsx
// =============================================

import React, { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getEquipoById } from "../utils/logic";
import Flag from "./Flag";

export default function Scorers() {
  const { equipos, goleadores } = useAppContext();
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const GRUPOS = ["Todos", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  // Construye el ranking agrupando por jugador+equipo
  const ranking = useMemo(() => {
    const mapa = {};

    goleadores.forEach(({ equipoId, jugador, cantidad }) => {
      if (!jugador) return;
      const key = `${equipoId}__${jugador}`;
      if (!mapa[key]) {
        const equipo = getEquipoById(equipos, equipoId);
        mapa[key] = {
          jugador,
          equipoId,
          equipo: equipo ? equipo.nombre : "?",
          grupo: equipo ? equipo.grupo : "?",
          goles: 0,
        };
      }
      mapa[key].goles += cantidad;
    });

    return Object.values(mapa).sort((a, b) => b.goles - a.goles);
  }, [goleadores, equipos]);

  const rankingFiltrado = ranking.filter(r => {
    if (filtroGrupo !== "Todos" && r.grupo !== filtroGrupo) return false;
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      if (!r.jugador.toLowerCase().includes(q) && !r.equipo.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="scorers-container">
      <h2 className="scorers-title">⚽ Tabla de Goleadores</h2>

      {/* Buscador */}
      <div className="scorers-busqueda">
        <input
          type="text"
          placeholder="Buscar jugador o equipo…"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Filtro por grupo */}
      <div className="selector-grupos">
        {GRUPOS.map(g => (
          <button
            key={g}
            className={filtroGrupo === g ? "activo" : ""}
            onClick={() => setFiltroGrupo(g)}
            style={{ width: g === "Todos" ? "auto" : "38px", padding: g === "Todos" ? "0 12px" : undefined }}
          >
            {g}
          </button>
        ))}
      </div>

      {rankingFiltrado.length === 0 ? (
        <p className="sin-goles">Todavía no hay goles cargados en este grupo.</p>
      ) : (
        <table className="scorers-table">
          <thead>
            <tr>
              <th>#</th>
              <th className="col-equipo">Jugador</th>
              <th className="col-equipo-header">Equipo</th>
              <th>Grupo</th>
              <th>⚽</th>
            </tr>
          </thead>
          <tbody>
            {rankingFiltrado.map((row, index) => (
              <tr key={`${row.equipoId}-${row.jugador}`} className={index < 3 ? "top-scorer" : ""}>
                <td>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                </td>
                <td className="col-equipo">{row.jugador}</td>
                <td className="col-equipo-header">
                  <span className="equipo-wrap"><Flag equipoId={row.equipoId} size="w40" className="bandera-img" />{row.equipo}</span>
                </td>
                <td>{row.grupo}</td>
                <td className="puntos">{row.goles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}