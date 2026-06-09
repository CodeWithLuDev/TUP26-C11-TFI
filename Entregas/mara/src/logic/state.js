const KEYS = {
  RESULTADOS: "cp26_resultados",
  GOLES: "cp26_goles",
  ZONA_HORARIA: "cp26_zona",
  TARJETAS: "cp26_tarjetas",
};

const SCHEMA_VERSION = 2;
const VERSION_KEY = "cp26_schema_version";

function _migrarSiHaceFalta() {
  const version = parseInt(localStorage.getItem(VERSION_KEY) ?? "0", 10);
  if (version >= SCHEMA_VERSION) return;
  localStorage.setItem(VERSION_KEY, String(SCHEMA_VERSION));
}

function _safeParse(raw, fallback) {
  try { return JSON.parse(raw); } catch { return fallback; }
}

// ─── RESULTADOS ───────────────────────────────────────────
// Estructura: { [partidoId]: { local: N, visitante: N, jugado: bool } }

export function getResultados() {
  const raw = localStorage.getItem(KEYS.RESULTADOS);
  return raw ? _safeParse(raw, {}) : {};
}

export function guardarResultado(partidoId, golesLocal, golesVisitante) {
  const resultados = getResultados();
  resultados[partidoId] = {
    local: parseInt(golesLocal, 10),
    visitante: parseInt(golesVisitante, 10),
    jugado: true,
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
  return raw ? _safeParse(raw, []) : [];
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

// ─── TARJETAS ─────────────────────────────────────────────
export function getTarjetas() {
  const raw = localStorage.getItem(KEYS.TARJETAS);
  return raw ? _safeParse(raw, []) : [];
}

export function guardarTarjeta(partidoId, equipoId, jugador, tipo) {
  const tarjetas = getTarjetas();
  tarjetas.push({ partidoId, equipoId, jugador, tipo, ts: Date.now() });
  localStorage.setItem(KEYS.TARJETAS, JSON.stringify(tarjetas));
}

export function borrarTarjetasDePartido(partidoId) {
  const tarjetas = getTarjetas().filter(t => t.partidoId !== partidoId);
  localStorage.setItem(KEYS.TARJETAS, JSON.stringify(tarjetas));
}

// ─── ZONA HORARIA ─────────────────────────────────────────
export function getZonaHoraria() {
  return parseInt(localStorage.getItem(KEYS.ZONA_HORARIA) ?? "-3", 10);
}

export function guardarZonaHoraria(offset) {
  localStorage.setItem(KEYS.ZONA_HORARIA, String(offset));
}

// ─── INIT (llamar al arranque) ────────────────────────────
export function initState() {
  _migrarSiHaceFalta();
}

// ─── RESET TOTAL (útil para testing) ─────────────────────
export function resetearTodo() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  localStorage.removeItem(VERSION_KEY);
}