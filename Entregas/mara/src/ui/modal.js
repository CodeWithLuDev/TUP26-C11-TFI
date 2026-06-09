import { getPartidoPorId } from "../data/partidos.js";
import { getEquipoPorId } from "../data/equipos.js";
import { getPlantelPorEquipo } from "../data/jugadores.js";
import {
  guardarResultado, borrarResultado,
  guardarGol, borrarGolesDePartido,
  getResultadoPartido, getGoles
} from "../logic/state.js";
import { renderFixture, attachFixtureListeners } from "./fixture.js";
import { actualizarTablaGrupo } from "./grupos.js";
import { lanzarCelebracion } from "./celebracion.js";
import { renderEstadisticas } from "./estadisticas.js";

const overlay = () => document.getElementById("modalOverlay");
const body = () => document.getElementById("modalBody");

let _partidoActual = null;
// Cola de goles cargados en el modal (antes de confirmar)
let _golesEnCurso = [];

// ─── ABRIR ────────────────────────────────────────────────
export function abrirModalResultado(partidoId) {
  _partidoActual = partidoId;
  _golesEnCurso = [];

  const p = getPartidoPorId(partidoId);
  const eqL = getEquipoPorId(p.local);
  const eqV = getEquipoPorId(p.visitante);
  const res = getResultadoPartido(partidoId);

  body().innerHTML = _renderModalBody(p, eqL, eqV, res);
  overlay().classList.add("active");

  _attachModalListeners(p, eqL, eqV);
}

// ─── CERRAR ───────────────────────────────────────────────
export function cerrarModal() {
  overlay().classList.remove("active");
  _partidoActual = null;
  _golesEnCurso = [];
}

// ─── INIT (listeners globales del modal) ─────────────────
export function initModal() {
  document.getElementById("modalCerrar")
    ?.addEventListener("click", cerrarModal);

  overlay()?.addEventListener("click", e => {
    if (e.target === overlay()) cerrarModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") cerrarModal();
  });
}

// ─── RENDER DEL BODY ──────────────────────────────────────
function _renderModalBody(p, eqL, eqV, res) {
  const glActual = res?.local ?? "";
  const gvActual = res?.visitante ?? "";

  return `
    <!-- Marcador -->
    <div style="text-align:center;margin-bottom:1rem;">
      <div style="font-family:var(--font-tiza);font-size:0.8rem;color:var(--tiza-sucia);margin-bottom:0.5rem;">
        Grupo ${p.grupo} · ${p.fecha} · ${p.sede.split(",")[0]}
      </div>
      <div style="display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-bottom:0.3rem;">
        <span style="font-size:1.2rem;">${eqL?.bandera}</span>
        <strong style="font-size:0.95rem;">${eqL?.nombre}</strong>
        <span style="color:var(--tiza-sucia);font-size:0.8rem;">vs</span>
        <strong style="font-size:0.95rem;">${eqV?.nombre}</strong>
        <span style="font-size:1.2rem;">${eqV?.bandera}</span>
      </div>
    </div>

    <!-- Inputs de marcador -->
    <div class="modal-marcador">
      <div style="text-align:center;">
        <div style="font-family:var(--font-tiza);font-size:0.75rem;color:var(--tiza-sucia);margin-bottom:0.3rem;">
          ${eqL?.nombre}
        </div>
        <input
          type="number" min="0" max="30"
          class="modal-campo marcador-input"
          id="golesLocal"
          value="${glActual}"
          placeholder="0"
        />
      </div>
      <span class="marcador-vs">—</span>
      <div style="text-align:center;">
        <div style="font-family:var(--font-tiza);font-size:0.75rem;color:var(--tiza-sucia);margin-bottom:0.3rem;">
          ${eqV?.nombre}
        </div>
        <input
          type="number" min="0" max="30"
          class="modal-campo marcador-input"
          id="golesVisitante"
          value="${gvActual}"
          placeholder="0"
        />
      </div>
    </div>

    <!-- Timeline de goles (solo al editar resultado existente) -->
    ${res?.jugado ? _renderTimeline(p.id, eqL, eqV) : ""}

    <!-- Sección goles opcionales -->
    <details style="margin-bottom:1rem;">
      <summary style="
        font-family:var(--font-tiza);
        font-size:0.85rem;
        color:var(--oro-claro);
        cursor:pointer;
        padding:0.4rem 0;
        list-style:none;
      ">
        ⚽ Registrar goleadores (opcional) ▼
      </summary>
      <div id="seccionGoles" style="margin-top:0.8rem;">
        ${_renderSelectorGol(eqL, eqV, p.id)}
      </div>
    </details>

    <!-- Lista de goles cargados -->
    <div id="listaGolesModal"></div>

    <!-- Feedback visual -->
    <div id="modalError" style="display:none;background:rgba(192,57,43,0.15);border:1px solid rgba(192,57,43,0.4);border-radius:4px;padding:0.5rem;margin-bottom:0.8rem;font-family:var(--font-tiza);font-size:0.85rem;color:var(--rojo-claro);text-align:center;"></div>

    <!-- Acciones -->
    <div class="modal-acciones">
      <button class="btn btn--secundario" id="btnCancelarModal">Cancelar</button>
      ${res?.jugado ? `
        <button class="btn btn--peligro" id="btnBorrarResultado">🗑 Borrar</button>
      ` : ""}
      <button class="btn btn--primario" id="btnConfirmarResultado">
        ✓ Confirmar
      </button>
    </div>
  `;
}

// ─── SELECTOR DE GOL ──────────────────────────────────────
function _renderSelectorGol(eqL, eqV, partidoId) {
  const plantelL = getPlantelPorEquipo(eqL.id);
  const plantelV = getPlantelPorEquipo(eqV.id);

  const opcionesL = plantelL.map(j =>
    `<option value="${j.nombre}" data-equipo="${eqL.id}">
      ${j.dorsal}. ${j.nombre}
    </option>`
  ).join("");

  const opcionesV = plantelV.map(j =>
    `<option value="${j.nombre}" data-equipo="${eqV.id}">
      ${j.dorsal}. ${j.nombre}
    </option>`
  ).join("");

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;margin-bottom:0.8rem;">
      <div class="modal-campo">
        <label>Goleador</label>
        <select id="selectGoleador">
          <option value="">— Seleccionar —</option>
          <optgroup label="${eqL.nombre}">${opcionesL}</optgroup>
          <optgroup label="${eqV.nombre}">${opcionesV}</optgroup>
        </select>
      </div>
      <div class="modal-campo">
        <label>Asistidor (opcional)</label>
        <select id="selectAsistidor">
          <option value="">— Sin asistencia —</option>
          <optgroup label="${eqL.nombre}">${opcionesL}</optgroup>
          <optgroup label="${eqV.nombre}">${opcionesV}</optgroup>
        </select>
      </div>
    </div>
    <button class="btn btn--secundario" id="btnAgregarGol"
      style="width:100%;font-size:0.8rem;">
      + Agregar gol a la lista
    </button>
  `;
}

// ─── LISTENERS DEL MODAL ──────────────────────────────────
function _attachModalListeners(p, eqL, eqV) {
  // Cancelar
  document.getElementById("btnCancelarModal")
    ?.addEventListener("click", cerrarModal);

  // Agregar gol a la lista temporal
  document.getElementById("btnAgregarGol")
    ?.addEventListener("click", () => {
      const goleador = document.getElementById("selectGoleador")?.value;
      const asistidor = document.getElementById("selectAsistidor")?.value;
      const selectGol = document.getElementById("selectGoleador");

      if (!goleador) return;

      const equipoId = selectGol.options[selectGol.selectedIndex]
        ?.dataset.equipo ?? eqL.id;

      _golesEnCurso.push({ goleador, equipoId, tipo: "gol" });
      if (asistidor) {
        const selA = document.getElementById("selectAsistidor");
        const eqAs = selA.options[selA.selectedIndex]?.dataset.equipo ?? eqL.id;
        _golesEnCurso.push({ goleador: asistidor, equipoId: eqAs, tipo: "asistencia" });
      }

      _renderListaGolesModal();
    });

  // Borrar resultado con confirmación
  document.getElementById("btnBorrarResultado")
    ?.addEventListener("click", () => {
      if (!confirm("¿Eliminar este resultado? No se puede deshacer.")) return;
      borrarResultado(p.id);
      borrarGolesDePartido(p.id);
      cerrarModal();
      renderFixture();
      attachFixtureListeners();
      actualizarTablaGrupo(p.grupo);
    });

  // Confirmar resultado
  document.getElementById("btnConfirmarResultado")
    ?.addEventListener("click", () => {
      const errEl = document.getElementById("modalError");
      const gl = parseInt(document.getElementById("golesLocal")?.value ?? "0", 10);
      const gv = parseInt(document.getElementById("golesVisitante")?.value ?? "0", 10);

      if (isNaN(gl) || isNaN(gv) || gl < 0 || gv < 0) {
        if (errEl) { errEl.textContent = "Ingresá un marcador válido"; errEl.style.display = "block"; }
        return;
      }
      if (errEl) errEl.style.display = "none";

      // Guardar resultado
      guardarResultado(p.id, gl, gv);

      // Guardar goles/asistencias
      borrarGolesDePartido(p.id); // limpiar anteriores
      _golesEnCurso.forEach(g => {
        guardarGol(p.id, g.equipoId, g.goleador, g.tipo);
      });

      cerrarModal();

      // Actualizar UI
      renderFixture();
      attachFixtureListeners();
      actualizarTablaGrupo(p.grupo);
      renderEstadisticas();

      // Celebración 🎉
      lanzarCelebracion();
    });
}

// ─── TIMELINE DE GOLES ─────────────────────────────────────
function _renderTimeline(partidoId, eqL, eqV) {
  const goles = getGoles().filter(g => g.partidoId === partidoId && g.tipo === "gol");
  if (!goles.length) return "";

  return `
    <div style="margin-bottom:1rem;padding:0.6rem;background:rgba(255,255,255,0.03);border-radius:4px;">
      <div style="font-family:var(--font-tiza);font-size:0.8rem;color:var(--oro-claro);margin-bottom:0.5rem;">
        ⚽ Timeline del partido
      </div>
      ${goles.map(g => {
        const esLocal = g.equipoId === eqL.id;
        const badge = esLocal ? eqL.bandera : eqV.bandera;
        const color = esLocal ? "var(--celeste-arg)" : "var(--rojo-claro)";
        const alinear = esLocal ? "flex-start" : "flex-end";
        return `
          <div style="display:flex;justify-content:${alinear};margin-bottom:0.3rem;">
            <div style="display:flex;align-items:center;gap:0.4rem;background:rgba(255,255,255,0.05);padding:0.25rem 0.6rem;border-radius:4px;border-left:3px solid ${color};">
              <span>${badge}</span>
              <span style="font-size:0.75rem;">${g.goleador}</span>
              <span style="font-size:0.6rem;color:var(--tiza-sucia);">⚽</span>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// ─── LISTA TEMPORAL DE GOLES ──────────────────────────────
function _renderListaGolesModal() {
  const el = document.getElementById("listaGolesModal");
  if (!el) return;

  if (_golesEnCurso.length === 0) {
    el.innerHTML = "";
    el.onclick = null;
    return;
  }

  el.innerHTML = `
    <div style="
      background:rgba(255,255,255,0.04);
      border-radius:4px;
      padding:0.6rem;
      margin-bottom:0.8rem;
      font-size:0.8rem;
    ">
      ${_golesEnCurso.map((g, i) => `
        <div style="display:flex;justify-content:space-between;padding:0.2rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
          <span>${g.tipo === "gol" ? "⚽" : "🎯"} ${g.goleador}</span>
          <button class="btn-quitar-gol" data-index="${i}"
            style="background:none;border:none;color:var(--rojo-claro);cursor:pointer;font-size:0.8rem;">
            ✕
          </button>
        </div>
      `).join("")}
    </div>
  `;

  el.onclick = e => {
    const btn = e.target.closest(".btn-quitar-gol");
    if (!btn) return;
    const idx = parseInt(btn.dataset.index, 10);
    _golesEnCurso.splice(idx, 1);
    _renderListaGolesModal();
  };
}