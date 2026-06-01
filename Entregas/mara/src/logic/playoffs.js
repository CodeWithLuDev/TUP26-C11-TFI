import { calcularTablaGrupo } from "./posiciones.js";
import { getResultadoPartido } from "./state.js";

// ─── CONSTANTES ──────────────────────────────────────────
const GRUPOS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const CRUCES_OCTAVOS_TEMPLATE = [
  { llave: "R16_01", local: "1A", visitante: "2B" },
  { llave: "R16_02", local: "1C", visitante: "2D" },
  { llave: "R16_03", local: "1E", visitante: "2F" },
  { llave: "R16_04", local: "1G", visitante: "2H" },
  { llave: "R16_05", local: "1I", visitante: "2J" },
  { llave: "R16_06", local: "1K", visitante: "2L" },
  { llave: "R16_07", local: "1B", visitante: "3ACEG" },
  { llave: "R16_08", local: "1D", visitante: "3BFHI" },
  // Cuartos de final se determinan dinámicamente
  { llave: "R16_09", local: "1F", visitante: "3CDJK" },
  { llave: "R16_10", local: "1H", visitante: "3ABIJ" },
  { llave: "R16_11", local: "1J", visitante: "3DEKO" },
  { llave: "R16_12", local: "1L", visitante: "3BGHL" },
  { llave: "R16_13", local: "1A", visitante: "3CDIJ" },
  { llave: "R16_14", local: "1C", visitante: "3EFGH" },
  { llave: "R16_15", local: "1E", visitante: "3ABKL" },
  { llave: "R16_16", local: "1K", visitante: "3FGJL" },
];

// ─── CLASIFICACIÓN DE GRUPOS ──────────────────────────────

export function calcularClasificados() {
  const primeros = [];
  const segundos = [];
  const terceros = [];

  for (const grupo of GRUPOS) {
    const tabla = calcularTablaGrupo(grupo);
    if (!tabla || tabla.length < 3) continue;

    const mapear = (entry) => ({
      id: entry.id,
      nombre: entry.nombre,
      bandera: entry.bandera,
      grupo,
      pts: entry.PTS,
      dif: entry.DG,
      gf: entry.GF,
    });

    primeros.push({ ...mapear(tabla[0]), puesto: 1 });
    segundos.push({ ...mapear(tabla[1]), puesto: 2 });
    terceros.push({ ...mapear(tabla[2]), puesto: 3 });
  }

  return { primeros, segundos, terceros };
}

export function getMejoresTerceros() {
  const { terceros } = calcularClasificados();

  const ordenados = [...terceros].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dif !== a.dif) return b.dif - a.dif;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return 0;
  });

  return ordenados.slice(0, 4);
}

export function isFaseGruposCompleta() {
  let total = 0;
  let jugados = 0;

  for (const grupo of GRUPOS) {
    ["1", "2", "3", "4", "5", "6"].forEach(n => {
      const id = `${grupo}${n}`;
      const resultado = getResultadoPartido(id);
      total++;
      if (resultado?.jugado) jugados++;
    });
  }

  return jugados >= 36;
}

export function construirBracket(estadoBracketGuardado = null) {
  // Si hay estado guardado en localStorage, lo restauramos
  if (estadoBracketGuardado) {
    return migrarBracket(estadoBracketGuardado);
  }

  const { primeros, segundos } = calcularClasificados();
  const mejoresTerceros = getMejoresTerceros();

  const resolver = (ref) => {
    if (ref.startsWith("1")) {
      const grupo = ref.slice(1);
      return primeros.find(e => e.grupo === grupo) || placeholderEquipo(`1°${grupo}`);
    }
    if (ref.startsWith("2")) {
      const grupo = ref.slice(1);
      return segundos.find(e => e.grupo === grupo) || placeholderEquipo(`2°${grupo}`);
    }
    if (ref.startsWith("3")) {
      // Mejor tercero disponible (simplificado)
      const disponible = mejoresTerceros.shift();
      return disponible || placeholderEquipo(`3°`);
    }
    return placeholderEquipo(ref);
  };

  const octavos = generarRonda("R16", 16, resolver);

  return {
    rondas: {
      octavos: octavos,
      cuartos: generarRondaVacia("QF", 8),
      semifinales: generarRondaVacia("SF", 4),
      tercerPuesto: generarRondaVacia("3PL", 1),
      final: generarRondaVacia("F", 1),
    },
    campeon: null,
    version: 1,
  };
}

// ─── HELPERS INTERNOS ────────────────────────────────────

function generarRonda(prefijo, cantidad, resolver) {
  return Array.from({ length: cantidad }, (_, i) => {
    const id = `${prefijo}_${String(i + 1).padStart(2, "0")}`;
    const tmpl = CRUCES_OCTAVOS_TEMPLATE[i];
    const local = tmpl ? resolver(tmpl.local) : placeholderEquipo("TBD");
    const visitante = tmpl ? resolver(tmpl.visitante) : placeholderEquipo("TBD");

    return crearPartido(id, local, visitante);
  });
}

function generarRondaVacia(prefijo, cantidad) {
  return Array.from({ length: cantidad }, (_, i) => {
    const id = `${prefijo}_${String(i + 1).padStart(2, "0")}`;
    return crearPartido(id, placeholderEquipo("TBD"), placeholderEquipo("TBD"));
  });
}

function crearPartido(id, local, visitante) {
  return {
    id,
    local: {
      equipo: local,
      goles: null,
      penales: null,
    },
    visitante: {
      equipo: visitante,
      goles: null,
      penales: null,
    },
    estado: "pendiente",
    resolucion: "normal",
    ganador: null,
  };
}

function placeholderEquipo(label) {
  return {
    id: label,
    nombre: label,
    bandera: "🏳️",
    grupo: null,
    pts: 0, dif: 0, gf: 0,
  };
}

function migrarBracket(guardado) {
  for (const ronda of Object.values(guardado.rondas)) {
    if (!Array.isArray(ronda)) continue;
    for (const partido of ronda) {
      partido.resolucion = partido.resolucion ?? "normal";
      partido.estado = partido.estado ?? "pendiente";
    }
  }
  return guardado;
}

// ─── LÓGICA DE AVANCE ────────────────────────────────────

/**
 * Registra el ganador de un partido y lo propaga a la siguiente ronda.
 * Retorna el bracket actualizado (inmutable — no muta el original).
 *
 * @param {object} bracket   - Estado actual del bracket
 * @param {string} partidoId - ID del partido (ej: "R16_01")
 * @param {object} resultado - { golesLocal, golesVisitante, resolucion, penalesLocal, penalesVisitante }
 * @returns {object} bracket actualizado
 */
export function registrarGanador(bracket, partidoId, resultado) {
  const nuevo = JSON.parse(JSON.stringify(bracket)); // copia profunda

  const partido = encontrarPartido(nuevo, partidoId);
  if (!partido) {
    console.warn(`[playoffs] Partido ${partidoId} no encontrado`);
    return nuevo;
  }

  const { golesLocal, golesVisitante, resolucion = "normal",
    penalesLocal = null, penalesVisitante = null } = resultado;

  partido.local.goles = golesLocal;
  partido.visitante.goles = golesVisitante;
  partido.local.penales = penalesLocal;
  partido.visitante.penales = penalesVisitante;
  partido.estado = "jugado";
  partido.resolucion = resolucion;

  // Determinar ganador
  let ganadorEquipo;
  if (golesLocal > golesVisitante) {
    ganadorEquipo = partido.local.equipo;
  } else if (golesVisitante > golesLocal) {
    ganadorEquipo = partido.visitante.equipo;
  } else {
    // Empate → resolver por penales
    if (penalesLocal !== null && penalesVisitante !== null) {
      ganadorEquipo = penalesLocal >= penalesVisitante
        ? partido.local.equipo
        : partido.visitante.equipo;
      partido.resolucion = "penales";
    } else {
      partido.resolucion = "extratime";
      ganadorEquipo = partido.local.equipo; // provisional hasta penales
    }
  }

  partido.ganador = ganadorEquipo?.id ?? null;

  // Propagar al siguiente partido
  propagarGanador(nuevo, partidoId, ganadorEquipo);

  // Si es la final, registrar campeón
  if (partidoId.startsWith("F_")) {
    nuevo.campeon = ganadorEquipo;
  }

  return nuevo;
}

function propagarGanador(bracket, partidoId, ganadorEquipo) {
  const mapa = buildMapaPropagacion();
  const destino = mapa[partidoId];
  if (!destino) return;

  const { siguienteId, posicion } = destino;
  const siguientePartido = encontrarPartido(bracket, siguienteId);
  if (!siguientePartido) return;

  if (posicion === "local") {
    siguientePartido.local.equipo = ganadorEquipo;
  } else {
    siguientePartido.visitante.equipo = ganadorEquipo;
  }
}

function buildMapaPropagacion() {
  const mapa = {};

  // Octavos → Cuartos
  const octavosCuartos = [
    ["R16_01", "QF_01", "local"], ["R16_02", "QF_01", "visitante"],
    ["R16_03", "QF_02", "local"], ["R16_04", "QF_02", "visitante"],
    ["R16_05", "QF_03", "local"], ["R16_06", "QF_03", "visitante"],
    ["R16_07", "QF_04", "local"], ["R16_08", "QF_04", "visitante"],
    ["R16_09", "QF_05", "local"], ["R16_10", "QF_05", "visitante"],
    ["R16_11", "QF_06", "local"], ["R16_12", "QF_06", "visitante"],
    ["R16_13", "QF_07", "local"], ["R16_14", "QF_07", "visitante"],
    ["R16_15", "QF_08", "local"], ["R16_16", "QF_08", "visitante"],
  ];

  // Cuartos → Semis
  const cuartosSemis = [
    ["QF_01", "SF_01", "local"], ["QF_02", "SF_01", "visitante"],
    ["QF_03", "SF_02", "local"], ["QF_04", "SF_02", "visitante"],
    ["QF_05", "SF_03", "local"], ["QF_06", "SF_03", "visitante"],
    ["QF_07", "SF_04", "local"], ["QF_08", "SF_04", "visitante"],
  ];

  // Semis → Final y 3er puesto
  const semisFinal = [
    ["SF_01", "F_01", "local"], ["SF_02", "F_01", "visitante"],
    ["SF_03", "F_01", "local"],      // bracket de 48: 4 semis → 2 finales
    ["SF_04", "F_01", "visitante"],
  ];

  // Perdedores de semis → 3er puesto (requiere lógica especial, simplificado aquí)
  const semisTercero = [
    ["SF_01", "3PL_01", "local"],
    ["SF_02", "3PL_01", "visitante"],
  ];

  [...octavosCuartos, ...cuartosSemis, ...semisFinal, ...semisTercero]
    .forEach(([origen, dest, pos]) => {
      mapa[origen] = { siguienteId: dest, posicion: pos };
    });

  return mapa;
}

function encontrarPartido(bracket, id) {
  for (const ronda of Object.values(bracket.rondas)) {
    if (!Array.isArray(ronda)) continue;
    const p = ronda.find(p => p.id === id);
    if (p) return p;
  }
  return null;
}

export function resetearPartido(bracket, partidoId) {
  const nuevo = JSON.parse(JSON.stringify(bracket));
  const partido = encontrarPartido(nuevo, partidoId);
  if (!partido) return nuevo;

  partido.local.goles = null;
  partido.visitante.goles = null;
  partido.local.penales = null;
  partido.visitante.penales = null;
  partido.estado = "pendiente";
  partido.resolucion = "normal";
  partido.ganador = null;

  return nuevo;
}

export function serializarBracket(bracket) {
  return JSON.stringify(bracket);
}

export function deserializarBracket(json) {
  try {
    return migrarBracket(JSON.parse(json));
  } catch {
    return null;
  }
}