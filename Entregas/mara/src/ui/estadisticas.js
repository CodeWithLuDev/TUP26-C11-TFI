// src/ui/estadisticas.js
// Renderiza la sección de estadísticas

import { getTopGoleadores, getTopAsistidores,
         getResumenTorneo }              from "../logic/estadisticas.js";
import { getEquipoPorId }               from "../data/equipos.js";

export function renderEstadisticas() {
  _renderTop("topGoleadores",  getTopGoleadores(),  "⚽ goles");
  _renderTop("topAsistidores", getTopAsistidores(), "🎯 asistencias");
  _renderResumen();
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
  const el  = document.getElementById("statsResumen");
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