// src/logic/state.js
// Fuente de verdad única — Lee y escribe en LocalStorage
// NUNCA manipula el DOM — solo datos

const KEYS = {
  RESULTADOS:   "cp26_resultados",
  GOLES:        "cp26_goles",
  ZONA_HORARIA: "cp26_zona",
};

// ─── RESULTADOS ───────────────────────────────────────────
// Estructura: { [partidoId]: { local: N, visitante: N, jugado: bool } }

export function getResultados() {
  const raw = localStorage.getItem(KEYS.RESULTADOS);
  return raw ? JSON.parse(raw) : {};
}

export function guardarResultado(partidoId, golesLocal, golesVisitante) {
  const resultados = getResultados();
  resultados[partidoId] = {
    local:      parseInt(golesLocal, 10),
    visitante:  parseInt(golesVisitante, 10),
    jugado:     true,
  };
  localStorage.setItem(KEYS.RESULTADOS, JSON.stringify(resultados));
}

export function borrarResultado(partidoId) {
  const resultados = getResultados();
  delete resultados[partidoId];
  localStorage.setItem(KEYS.RESULTADOS, JSON.stringify(resultados));
}

export function getResultadoPartido(partidoId) {
  return getResultados()[partidoId] || null;
}

// ─── GOLES / ASISTENCIAS ──────────────────────────────────
// Estructura: [ { partidoId, equipoId, jugador, tipo: "gol"|"asistencia" } ]

export function getGoles() {
  const raw = localStorage.getItem(KEYS.GOLES);
  return raw ? JSON.parse(raw) : [];
}

export function guardarGol(partidoId, equipoId, jugador, tipo = "gol") {
  const goles = getGoles();
  goles.push({ partidoId, equipoId, jugador, tipo, ts: Date.now() });
  localStorage.setItem(KEYS.GOLES, JSON.stringify(goles));
}

export function borrarGolesDePartido(partidoId) {
  const goles = getGoles().filter(g => g.partidoId !== partidoId);
  localStorage.setItem(KEYS.GOLES, JSON.stringify(goles));
}

// ─── ZONA HORARIA ─────────────────────────────────────────
export function getZonaHoraria() {
  return parseInt(localStorage.getItem(KEYS.ZONA_HORARIA) ?? "-3", 10);
}

export function guardarZonaHoraria(offset) {
  localStorage.setItem(KEYS.ZONA_HORARIA, String(offset));
}

// ─── RESET TOTAL (útil para testing) ─────────────────────
export function resetearTodo() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}