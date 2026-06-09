import { GRUPOS } from "../data/equipos.js";
import { getPartidosPorGrupo } from "../data/partidos.js";
import { getResultados } from "../logic/state.js";
import { calcularTablaGrupo } from "../logic/posiciones.js";

const MI_EQUIPO = "ARG";

function _renderTablaHTML(grupo) {
  const tabla = calcularTablaGrupo(grupo);
  return `
    <table class="tabla-posiciones">
      <thead>
        <tr>
          <th>#</th>
          <th>Equipo</th>
          <th title="Partidos Jugados">PJ</th>
          <th title="Partidos Ganados">PG</th>
          <th title="Partidos Empatados">PE</th>
          <th title="Partidos Perdidos">PP</th>
          <th title="Goles a Favor">GF</th>
          <th title="Goles en Contra">GC</th>
          <th title="Diferencia de Goles">DG</th>
          <th title="Puntos">PTS</th>
          <th title="Últimos resultados">F</th>
        </tr>
      </thead>
      <tbody>
        ${tabla.map((eq, i) => {
          const cls = `${i < 2 ? "clasificado" : i === 2 ? "posible" : ""} ${eq.id === MI_EQUIPO ? "mi-equipo" : ""}`;
          const dgCls = eq.DG > 0 ? "text-oro" : eq.DG < 0 ? "text-rojo" : "";
          const dgVal = eq.DG > 0 ? `+${eq.DG}` : eq.DG;
          return `
            <tr class="${cls}" data-equipo="${eq.id}">
              <td>${i + 1}</td>
              <td>
                <div class="equipo-cell">
                  <span class="equipo-bandera">${eq.bandera}</span>
                  <span class="equipo-nombre">${eq.nombre}</span>
                  ${eq.id === MI_EQUIPO ? '<span class="mi-equipo-badge">⭐</span>' : ""}
                </div>
              </td>
              <td>${eq.PJ}</td>
              <td>${eq.PG}</td>
              <td>${eq.PE}</td>
              <td>${eq.PP}</td>
              <td>${eq.GF}</td>
              <td>${eq.GC}</td>
              <td class="${dgCls}">${dgVal}</td>
              <td><strong>${eq.PTS}</strong></td>
              <td>${_renderForma(eq.id, grupo)}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

export function renderGruposCompletos() {
  const grid = document.getElementById("gruposGrid");
  if (!grid) return;

  grid.innerHTML = GRUPOS.map(grupo => {
    const terminado = grupoTerminado(grupo);
    return `
      <div class="grupo-card" id="grupo-card-${grupo}">
        <div class="grupo-card__header">
          <span class="grupo-card__titulo">GRUPO ${grupo}</span>
          ${terminado ? '<span class="grupo-card__badge">COMPLETO</span>' : ""}
        </div>
        ${_renderTablaHTML(grupo)}
      </div>
    `;
  }).join("");
}

function grupoTerminado(grupo) {
  const partidos = getPartidosPorGrupo(grupo);
  const resultados = getResultados();
  return partidos.every(p => resultados[p.id]?.jugado);
}

export function actualizarTablaGrupo(grupo) {
  const card = document.getElementById(`grupo-card-${grupo}`);
  if (!card) return;

  const oldRows = {};
  card.querySelectorAll("tr[data-equipo]").forEach(tr => {
    const pts = tr.querySelector("td:last-child")?.textContent?.trim();
    if (tr.dataset.equipo) oldRows[tr.dataset.equipo] = pts;
  });

  const oldTable = card.querySelector("table");
  const newHTML = _renderTablaHTML(grupo);
  const wrapper = document.createElement("div");
  wrapper.innerHTML = newHTML;
  const newTable = wrapper.firstElementChild;

  if (oldTable) oldTable.replaceWith(newTable);

  newTable.querySelectorAll("tr[data-equipo]").forEach(tr => {
    const id = tr.dataset.equipo;
    const pts = tr.querySelector("td:last-child")?.textContent?.trim();
    if (oldRows[id] !== undefined && oldRows[id] !== pts) {
      tr.classList.add("actualizado");
    }
  });
}

function _getForma(equipoId, grupo) {
  const partidos = getPartidosPorGrupo(grupo);
  const resultados = getResultados();

  return partidos
    .filter(p => (p.local === equipoId || p.visitante === equipoId) && resultados[p.id]?.jugado)
    .sort((a, b) => a.jornada - b.jornada)
    .map(p => {
      const r = resultados[p.id];
      if (p.local === equipoId) {
        if (r.local > r.visitante) return "W";
        if (r.local < r.visitante) return "L";
        return "D";
      }
      if (r.visitante > r.local) return "W";
      if (r.visitante < r.local) return "L";
      return "D";
    });
}

function _renderForma(equipoId, grupo) {
  const forma = _getForma(equipoId, grupo);
  if (!forma.length) return `<span class="forma-empty">—</span>`;
  return forma.map(r => {
    const color = r === "W" ? "#2ecc71" : r === "D" ? "#f1c40f" : "#e74c3c";
    return `<span class="forma-dot" style="background:${color};">${r}</span>`;
  }).join("");
}
