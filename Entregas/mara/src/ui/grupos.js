// src/ui/grupos.js
// Renderiza la fase de grupos en el DOM
// NUNCA contiene lógica de cálculo

import { GRUPOS }             from "../data/equipos.js";
import { calcularTablaGrupo } from "../logic/posiciones.js";

const contenedor = () => document.getElementById("gruposContenido");
const tabsEl     = () => document.getElementById("gruposTabs");

let grupoActivo = "A";

// ─── INIT ─────────────────────────────────────────────────
export function initGrupos() {
  renderTabs();
  renderTablaGrupo(grupoActivo);
}

// ─── TABS A-L ─────────────────────────────────────────────
function renderTabs() {
  const tabs = tabsEl();
  if (!tabs) return;

  tabs.innerHTML = GRUPOS.map(g => `
    <button
      class="grupo-tab ${g === grupoActivo ? "active" : ""}"
      data-grupo="${g}">
      ${g}
    </button>
  `).join("");

  tabs.addEventListener("click", e => {
    const btn = e.target.closest(".grupo-tab");
    if (!btn) return;
    grupoActivo = btn.dataset.grupo;
    tabs.querySelectorAll(".grupo-tab").forEach(b =>
      b.classList.toggle("active", b.dataset.grupo === grupoActivo)
    );
    renderTablaGrupo(grupoActivo);
  });
}

// ─── TABLA DE POSICIONES ─────────────────────────────────
export function renderTablaGrupo(grupo) {
  const el = contenedor();
  if (!el) return;

  const tabla = calcularTablaGrupo(grupo);

  el.innerHTML = `
    <div class="grupo-nombre">
      <span class="font-titulo text-oro" style="font-size:1.1rem;letter-spacing:2px;">
        GRUPO ${grupo}
      </span>
    </div>
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
        </tr>
      </thead>
      <tbody>
        ${tabla.map((eq, i) => `
          <tr
            class="${i < 2 ? "clasificado" : i === 2 ? "posible" : ""}"
            data-equipo="${eq.id}"
            id="fila-${eq.id}">
            <td>${i + 1}</td>
            <td>
              <div class="equipo-cell">
                <span class="equipo-bandera">${eq.bandera}</span>
                <span class="equipo-nombre">${eq.nombre}</span>
              </div>
            </td>
            <td>${eq.PJ}</td>
            <td>${eq.PG}</td>
            <td>${eq.PE}</td>
            <td>${eq.PP}</td>
            <td>${eq.GF}</td>
            <td>${eq.GC}</td>
            <td class="${eq.DG > 0 ? "text-oro" : eq.DG < 0 ? "text-rojo" : ""}">
              ${eq.DG > 0 ? "+" : ""}${eq.DG}
            </td>
            <td><strong>${eq.PTS}</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <p style="font-family:var(--font-tiza);font-size:0.72rem;color:var(--tiza-sucia);margin-top:0.5rem;padding-left:0.3rem;">
      🟡 Clasificados directos &nbsp;|&nbsp; 🔵 Posible clasificado
    </p>
  `;
}

// ─── ACTUALIZAR TABLA (con animación flash) ───────────────
export function actualizarTablaGrupo(grupo) {
  // Guardar qué grupo está activo y re-renderizar
  if (grupo === grupoActivo) {
    // Capturar filas actuales para comparar
    const filasAntes = {};
    document.querySelectorAll("#gruposContenido tr[data-equipo]").forEach(tr => {
      filasAntes[tr.dataset.equipo] = tr.querySelector("td:last-child")?.textContent?.trim();
    });

    renderTablaGrupo(grupo);

    // Flashear filas que cambiaron
    document.querySelectorAll("#gruposContenido tr[data-equipo]").forEach(tr => {
      const id    = tr.dataset.equipo;
      const antes = filasAntes[id];
      const ahora = tr.querySelector("td:last-child")?.textContent?.trim();
      if (antes !== undefined && antes !== ahora) {
        tr.classList.remove("actualizado");
        void tr.offsetWidth; // force reflow
        tr.classList.add("actualizado");
      }
    });
  }
}