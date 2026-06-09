import {
  getTopGoleadores, getTopAsistidores,
  getResumenTorneo, getGolesDePartido
} from "../logic/estadisticas.js";
import { getEquipoPorId } from "../data/equipos.js";
import { getPartidoPorId } from "../data/partidos.js";
import { getResultados, getTarjetas, getGoles } from "../logic/state.js";

export function renderEstadisticas() {
  _renderTop("topGoleadores", getTopGoleadores(), "⚽ goles");
  _renderTop("topAsistidores", getTopAsistidores(), "🎯 asistencias");
  _renderResumen();
  _renderFairPlay();
  _renderGolesPorJornada();
  _renderEstadisticasEquipos();
  _renderPartidoTop();
}

function _renderTop(elId, lista, unidad) {
  const el = document.getElementById(elId);
  if (!el) return;

  if (lista.length === 0) {
    const label = unidad.includes("goles") ? "Sin goles registrados" : "Sin asistencias registradas";
    el.innerHTML = `<li class="stats-lista__vacio">${label}</li>`;
    return;
  }

  el.innerHTML = lista.map(item => {
    const eq = getEquipoPorId(item.equipoId);
    return `
      <li>
        <span>${eq?.bandera ?? "🏳️"}</span>
        <span>${item.jugador}</span>
        <span style="font-size:0.75rem;color:var(--tiza-sucia);">${eq?.nombre ?? item.equipoId}</span>
        <span class="stats-lista__goles">${item.cantidad} ${unidad}</span>
      </li>
    `;
  }).join("");
}

function _renderResumen() {
  const el = document.getElementById("statsResumen");
  const res = getResumenTorneo();
  if (!el) return;

  el.innerHTML = `
    <div class="stats-kpi">
      <span class="stats-kpi__valor">${res.totalGoles}</span>
      <span class="stats-kpi__label">Goles totales</span>
    </div>
    <div class="stats-kpi">
      <span class="stats-kpi__valor">${res.totalPartidos}</span>
      <span class="stats-kpi__label">Partidos jugados</span>
    </div>
    <div class="stats-kpi">
      <span class="stats-kpi__valor">${res.promedioGoles}</span>
      <span class="stats-kpi__label">Goles por partido</span>
    </div>
    <div class="stats-kpi">
      <span class="stats-kpi__valor">${res.equiposConGoles}</span>
      <span class="stats-kpi__label">Equipos goleadores</span>
    </div>
  `;
}

// ─── FAIR PLAY ─────────────────────────────────────────────
function _renderFairPlay() {
  const el = document.getElementById("statsFairPlay");
  if (!el) return;

  const tarjetas = getTarjetas();
  const equipos = {};

  tarjetas.forEach(t => {
    if (!equipos[t.equipoId]) equipos[t.equipoId] = { amarillas: 0, rojas: 0 };
    equipos[t.equipoId][t.tipo === "amarilla" ? "amarillas" : "rojas"]++;
  });

  const filas = Object.entries(equipos).map(([id, c]) => {
    const eq = getEquipoPorId(id);
    const puntaje = c.amarillas + c.rojas * 2;
    return { id, nombre: eq?.nombre ?? id, bandera: eq?.bandera ?? "🏳️", ...c, puntaje };
  }).sort((a, b) => b.puntaje - a.puntaje);

  if (!filas.length) {
    el.innerHTML = `<div class="placeholder-tiza"><p>Sin tarjetas registradas</p></div>`;
    return;
  }

  el.innerHTML = `
    <div class="fp-table">
      <div class="fp-table__head">
        <span>#</span><span>Equipo</span><span>🟨</span><span>🟥</span><span>Pts</span>
      </div>
      ${filas.map((f, i) => `
        <div class="fp-table__row">
          <span>${i + 1}</span>
          <span>${f.bandera} ${f.nombre}</span>
          <span>${f.amarillas}</span>
          <span>${f.rojas}</span>
          <span class="fp-table__pts">${f.puntaje}</span>
        </div>
      `).join("")}
    </div>
  `;
}

// ─── GOLES POR JORNADA (barras) ────────────────────────────
function _renderGolesPorJornada() {
  const el = document.getElementById("statsGolesJornada");
  if (!el) return;

  const resultados = getResultados();
  const jornadas = { 1: 0, 2: 0, 3: 0 };
  let maxGoles = 0;

  Object.entries(resultados).forEach(([id, r]) => {
    if (!r.jugado) return;
    const p = getPartidoPorId(id);
    if (!p) return;
    const total = r.local + r.visitante;
    jornadas[p.jornada] = (jornadas[p.jornada] || 0) + total;
    if (jornadas[p.jornada] > maxGoles) maxGoles = jornadas[p.jornada];
  });

  const hayGoles = Object.values(jornadas).some(v => v > 0);

  if (!hayGoles) {
    el.innerHTML = `<div class="placeholder-tiza"><p>Sin partidos jugados</p></div>`;
    return;
  }

  el.innerHTML = `
    <div class="bar-chart">
      ${[1, 2, 3].map(j => {
        const val = jornadas[j] || 0;
        const pct = maxGoles > 0 ? (val / maxGoles * 100) : 0;
        return `
          <div class="bar-chart__item">
            <span class="bar-chart__label">Jornada ${j}</span>
            <div class="bar-chart__track">
              <div class="bar-chart__bar" style="width:${pct}%"></div>
            </div>
            <span class="bar-chart__valor">${val} ⚽</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// ─── ESTADÍSTICAS POR EQUIPO ───────────────────────────────
function _renderEstadisticasEquipos() {
  const el = document.getElementById("statsEquipos");
  if (!el) return;

  const resultados = getResultados();
  const goles = getGoles();
  const equiposStats = {};

  Object.entries(resultados).forEach(([id, r]) => {
    if (!r.jugado) return;
    const p = getPartidoPorId(id);
    if (!p) return;

    [{ id: p.local, gf: r.local, gc: r.visitante },
     { id: p.visitante, gf: r.visitante, gc: r.local }].forEach(eq => {
      if (!equiposStats[eq.id]) equiposStats[eq.id] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0 };
      const s = equiposStats[eq.id];
      s.pj++;
      s.gf += eq.gf;
      s.gc += eq.gc;
      if (eq.gf > eq.gc) s.pg++;
      else if (eq.gf === eq.gc) s.pe++;
      else s.pp++;
    });
  });

  // Mejor goleador por equipo
  const goleadoresEq = {};
  goles.filter(g => g.tipo === "gol").forEach(g => {
    if (!goleadoresEq[g.equipoId]) goleadoresEq[g.equipoId] = {};
    goleadoresEq[g.equipoId][g.jugador] = (goleadoresEq[g.equipoId][g.jugador] || 0) + 1;
  });

  const filas = Object.entries(equiposStats).map(([id, s]) => {
    const eq = getEquipoPorId(id);
    const mejores = Object.entries(goleadoresEq[id] || {});
    mejores.sort((a, b) => b[1] - a[1]);
    const mejorGoleador = mejores.length ? `${mejores[0][0]} (${mejores[0][1]})` : "—";
    return {
      id, nombre: eq?.nombre ?? id, bandera: eq?.bandera ?? "🏳️",
      ...s, dif: s.gf - s.gc, mejorGoleador
    };
  }).sort((a, b) => b.pg - a.pg || (b.dif - a.dif));

  if (!filas.length) {
    el.innerHTML = `<div class="placeholder-tiza"><p>Sin partidos jugados</p></div>`;
    return;
  }

  el.innerHTML = `
    <div class="team-stats-scroll">
      <table class="team-stats">
        <thead>
          <tr>
            <th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th>
            <th>GF</th><th>GC</th><th>DIF</th><th>★ Goleador</th>
          </tr>
        </thead>
        <tbody>
          ${filas.map((f, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${f.bandera} ${f.nombre}</td>
              <td>${f.pj}</td>
              <td>${f.pg}</td>
              <td>${f.pe}</td>
              <td>${f.pp}</td>
              <td>${f.gf}</td>
              <td>${f.gc}</td>
              <td class="${f.dif > 0 ? "text-verde" : f.dif < 0 ? "text-rojo" : ""}">${f.dif > 0 ? "+" : ""}${f.dif}</td>
              <td style="font-size:0.7rem;color:var(--tiza-sucia);">${f.mejorGoleador}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// ─── PARTIDO CON MÁS GOLES ─────────────────────────────────
function _renderPartidoTop() {
  const el = document.getElementById("statsPartidoTop");
  if (!el) return;

  const resultados = getResultados();
  let topId = null;
  let topTotal = -1;

  Object.entries(resultados).forEach(([id, r]) => {
    if (!r.jugado) return;
    const total = r.local + r.visitante;
    if (total > topTotal) { topTotal = total; topId = id; }
  });

  if (!topId) {
    el.innerHTML = `<div class="placeholder-tiza"><p>Sin partidos jugados</p></div>`;
    return;
  }

  const p = getPartidoPorId(topId);
  const r = resultados[topId];
  const eqL = getEquipoPorId(p.local);
  const eqV = getEquipoPorId(p.visitante);

  const golesPartido = getGolesDePartido(topId);
  const goleadores = golesPartido.filter(g => g.tipo === "gol").map(g => g.jugador);
  const unicos = [...new Set(goleadores)];

  el.innerHTML = `
    <div class="partido-top-card">
      <div class="partido-top-card__marcador">
        <span>${eqL?.bandera ?? "🏳️"} ${eqL?.nombre ?? p.local}</span>
        <span class="partido-top-card__goles">${r.local} — ${r.visitante}</span>
        <span>${eqV?.nombre ?? p.visitante} ${eqV?.bandera ?? "🏳️"}</span>
      </div>
      <div class="partido-top-card__meta">
        Grupo ${p.grupo} · ${p.fecha} · ${p.sede.split(",")[0]}
      </div>
      <div style="font-size:1.1rem;font-family:var(--font-tiza);text-align:center;padding:0.4rem 0;">
        🔥 ${topTotal} goles
      </div>
      ${unicos.length ? `
        <div style="font-size:0.75rem;color:var(--tiza-sucia);text-align:center;">
          Goleadores: ${unicos.join(", ")}
        </div>
      ` : ""}
    </div>
  `;
}
