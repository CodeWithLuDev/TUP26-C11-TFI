// src/logic/estadisticas.js
// Gestión de goleadores y asistidores
// NUNCA manipula el DOM

import { getGoles } from "./state.js";

// ─── TOP GOLEADORES ───────────────────────────────────────
export function getTopGoleadores(limite = 10) {
  return _buildRanking("gol", limite);
}

// ─── TOP ASISTIDORES ─────────────────────────────────────
export function getTopAsistidores(limite = 10) {
  return _buildRanking("asistencia", limite);
}

// ─── RESUMEN GENERAL ─────────────────────────────────────
export function getResumenTorneo() {
  const todos     = getGoles();
  const goles     = todos.filter(g => g.tipo === "gol");
  const partidos  = [...new Set(todos.map(g => g.partidoId))];
  const equipos   = [...new Set(todos.map(g => g.equipoId))];

  return {
    totalGoles:       goles.length,
    totalPartidos:    partidos.length,
    equiposConGoles:  equipos.length,
    promedioGoles:    partidos.length > 0
      ? (goles.length / partidos.length).toFixed(2)
      : "0.00",
  };
}

// ─── GOLES DE UN PARTIDO ESPECÍFICO ──────────────────────
export function getGolesDePartido(partidoId) {
  return getGoles().filter(g => g.partidoId === partidoId);
}

// ─── HELPER INTERNO ──────────────────────────────────────
function _buildRanking(tipo, limite) {
  const registros = getGoles().filter(g => g.tipo === tipo);

  // Agrupar por jugador
  const conteo = {};
  registros.forEach(({ jugador, equipoId }) => {
    const key = `${jugador}__${equipoId}`;
    if (!conteo[key]) {
      conteo[key] = { jugador, equipoId, cantidad: 0 };
    }
    conteo[key].cantidad++;
  });

  return Object.values(conteo)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, limite);
}