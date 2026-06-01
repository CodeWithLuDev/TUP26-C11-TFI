// src/logic/posiciones.js
// Calcula tablas de posiciones con criterios FIFA
// NUNCA manipula el DOM

import { getEquiposPorGrupo } from "../data/equipos.js";
import { getPartidosPorGrupo } from "../data/partidos.js";
import { getResultados }        from "./state.js";

// ─── CALCULAR TABLA DE UN GRUPO ───────────────────────────
export function calcularTablaGrupo(grupo) {
  const equipos    = getEquiposPorGrupo(grupo);
  const partidos   = getPartidosPorGrupo(grupo);
  const resultados = getResultados();

  // Inicializar stats por equipo
  const stats = {};
  equipos.forEach(eq => {
    stats[eq.id] = {
      id:    eq.id,
      nombre: eq.nombre,
      bandera: eq.bandera,
      PJ: 0, PG: 0, PE: 0, PP: 0,
      GF: 0, GC: 0, DG: 0, PTS: 0,
      // Para desempate por enfrentamiento directo
      _directos: {},
    };
  });

  // Procesar cada partido jugado
  partidos.forEach(p => {
    const res = resultados[p.id];
    if (!res || !res.jugado) return;

    const L = stats[p.local];
    const V = stats[p.visitante];
    if (!L || !V) return;

    const gl = res.local;
    const gv = res.visitante;

    // Partidos jugados
    L.PJ++; V.PJ++;

    // Goles
    L.GF += gl; L.GC += gv;
    V.GF += gv; V.GC += gl;

    // Resultado
    if (gl > gv) {
      // Gana local
      L.PG++; L.PTS += 3;
      V.PP++;
    } else if (gl < gv) {
      // Gana visitante
      V.PG++; V.PTS += 3;
      L.PP++;
    } else {
      // Empate
      L.PE++; L.PTS += 1;
      V.PE++; V.PTS += 1;
    }

    // Registrar enfrentamiento directo (para desempate)
    if (!L._directos[V.id]) L._directos[V.id] = { GF: 0, GC: 0, PTS: 0 };
    if (!V._directos[L.id]) V._directos[L.id] = { GF: 0, GC: 0, PTS: 0 };

    L._directos[V.id].GF += gl;
    L._directos[V.id].GC += gv;
    V._directos[L.id].GF += gv;
    V._directos[L.id].GC += gl;

    if (gl > gv) {
      L._directos[V.id].PTS += 3;
    } else if (gl < gv) {
      V._directos[L.id].PTS += 3;
    } else {
      L._directos[V.id].PTS += 1;
      V._directos[L.id].PTS += 1;
    }
  });

  // Calcular DG
  Object.values(stats).forEach(s => { s.DG = s.GF - s.GC; });

  // Ordenar con criterios FIFA
  const tabla = Object.values(stats).sort((a, b) => {
    // 1. Puntos
    if (b.PTS !== a.PTS) return b.PTS - a.PTS;
    // 2. Diferencia de goles
    if (b.DG !== a.DG)   return b.DG - a.DG;
    // 3. Goles a favor
    if (b.GF !== a.GF)   return b.GF - a.GF;
    // 4. Enfrentamiento directo (puntos)
    const dA = a._directos[b.id]?.PTS ?? 0;
    const dB = b._directos[a.id]?.PTS ?? 0;
    if (dB !== dA) return dB - dA;
    // 5. DG en enfrentamiento directo
    const dgA = (a._directos[b.id]?.GF ?? 0) - (a._directos[b.id]?.GC ?? 0);
    const dgB = (b._directos[a.id]?.GF ?? 0) - (b._directos[a.id]?.GC ?? 0);
    if (dgB !== dgA) return dgB - dgA;
    // 6. Sin desempate → orden alfabético
    return a.nombre.localeCompare(b.nombre);
  });

  return tabla;
}

// ─── CALCULAR TODAS LAS TABLAS ────────────────────────────
export function calcularTodasLasTablas() {
  const grupos = ["A","B","C","D","E","F","G","H","I","J","K","L"];
  const tablas = {};
  grupos.forEach(g => { tablas[g] = calcularTablaGrupo(g); });
  return tablas;
}

// ─── OBTENER CLASIFICADOS DE UN GRUPO ────────────────────
// Devuelve los 2 primeros + el tercero para el ranking de mejores terceros
export function getClasificadosGrupo(grupo) {
  const tabla = calcularTablaGrupo(grupo);
  return {
    primero:  tabla[0] ?? null,
    segundo:  tabla[1] ?? null,
    tercero:  tabla[2] ?? null,
  };
}

// ─── VERIFICAR SI UN GRUPO TERMINÓ ────────────────────────
export function grupoTerminado(grupo) {
  const partidos   = getPartidosPorGrupo(grupo);
  const resultados = getResultados();
  return partidos.every(p => resultados[p.id]?.jugado === true);
}