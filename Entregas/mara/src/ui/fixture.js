import { PARTIDOS, getPartidosHoy, FECHAS } from "../data/partidos.js";
import { getEquipoPorId } from "../data/equipos.js";
import { getResultadoPartido } from "../logic/state.js";
import { getZonaHoraria } from "../logic/state.js";
import { abrirModalResultado } from "./modal.js";

const contenedor = () => document.getElementById("fixtureContenido");

let filtroActivo = "hoy";

// ─── INIT ─────────────────────────────────────────────────
export function initFixture() {
  renderFiltroTabs();
  renderFixture(filtroActivo);
}

// ─── TABS HOY / FECHA / GRUPO ─────────────────────────────
function renderFiltroTabs() {
  document.querySelectorAll(".fixture-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".fixture-tab")
        .forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      filtroActivo = tab.dataset.filtro;
      renderFixture(filtroActivo);
    });
  });
}

// ─── RENDER PRINCIPAL ─────────────────────────────────────
export function renderFixture(filtro = filtroActivo) {
  const el = contenedor();
  if (!el) return;

  let partidos = [];

  if (filtro === "hoy") {
    partidos = getPartidosHoy();
    if (partidos.length === 0) {
      // Si hoy no hay partidos mostrar los próximos
      const hoy = new Date().toISOString().split("T")[0];
      partidos = PARTIDOS.filter(p => p.fecha >= hoy).slice(0, 8);
    }
  } else if (filtro === "fecha") {
    partidos = _getPartidosPorFechaAgrupados();
  } else if (filtro === "grupo") {
    partidos = _getPartidosPorGrupoAgrupados();
  }

  if (filtro === "fecha") {
    el.innerHTML = _renderAgrupado(partidos, "fecha");
    return;
  }
  if (filtro === "grupo") {
    el.innerHTML = _renderAgrupado(partidos, "grupo");
    return;
  }

  // Vista "hoy" o por defecto
  if (partidos.length === 0) {
    el.innerHTML = `<div class="placeholder-tiza"><p>No hay partidos programados para hoy</p></div>`;
    return;
  }

  el.innerHTML = partidos.map(p => _renderPartidoCard(p)).join("");
  attachFixtureListeners();
}

// ─── RENDER AGRUPADO (por fecha o por grupo) ──────────────
function _renderAgrupado(grupos, tipo) {
  return Object.entries(grupos).map(([clave, partidos]) => `
    <div class="fixture-grupo-header">
      <span class="font-titulo text-oro" style="font-size:0.9rem;letter-spacing:1px;">
        ${tipo === "fecha" ? _formatFecha(clave) : `GRUPO ${clave}`}
      </span>
    </div>
    ${partidos.map(p => _renderPartidoCard(p)).join("")}
  `).join("");
}

// ─── CARD DE PARTIDO ──────────────────────────────────────
function _renderPartidoCard(p) {
  const eqL = getEquipoPorId(p.local);
  const eqV = getEquipoPorId(p.visitante);
  const res = getResultadoPartido(p.id);
  const hora = _ajustarHora(p.hora, p.fecha);

  const claseCard = res?.jugado ? "jugado" : "";

  const resultado = res?.jugado
    ? `<span class="partido-resultado">${res.local} — ${res.visitante}</span>`
    : `<span class="partido-vs">${hora}</span>`;

  return `
    <div class="partido-card ${claseCard}" data-partido="${p.id}">
      <div class="partido-info">
        <div class="partido-equipo">
          <span>${eqL?.bandera ?? "🏳️"}</span>
          <span>${eqL?.nombre ?? p.local}</span>
        </div>
        ${resultado}
        <div class="partido-equipo partido-equipo--visitante">
          <span>${eqV?.nombre ?? p.visitante}</span>
          <span>${eqV?.bandera ?? "🏳️"}</span>
        </div>
      </div>
      <div class="partido-meta">
        <span class="partido-meta__grupo">GRP ${p.grupo}</span>
        <span>${p.sede.split(",")[0]}</span>
        <span>${_formatFecha(p.fecha)}</span>
      </div>
      ${!res?.jugado ? `
        <button class="btn-cargar" data-partido="${p.id}">
          + Cargar resultado
        </button>
      ` : `
        <button class="btn-cargar btn-cargar--editar" data-partido="${p.id}"
          style="border-color:rgba(192,57,43,0.4);color:var(--rojo-claro);">
          ✏️ Editar resultado
        </button>
      `}
    </div>
  `;
}

// ─── LISTENERS ────────────────────────────────────────────
function _attachListeners(el) {
  el.querySelectorAll(".btn-cargar").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const partidoId = btn.dataset.partido;
      abrirModalResultado(partidoId);
    });
  });
}

// Reattach después de cada render
export function attachFixtureListeners() {
  _attachListeners(contenedor());
}

// ─── HELPERS DE AGRUPACIÓN ────────────────────────────────
function _getPartidosPorFechaAgrupados() {
  const grupos = {};
  FECHAS.forEach(f => {
    const ps = PARTIDOS.filter(p => p.fecha === f);
    if (ps.length) grupos[f] = ps;
  });
  return grupos;
}

function _getPartidosPorGrupoAgrupados() {
  const grupos = {};
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].forEach(g => {
    const ps = PARTIDOS.filter(p => p.grupo === g);
    if (ps.length) grupos[g] = ps;
  });
  return grupos;
}

// ─── HELPERS DE FORMATO ───────────────────────────────────
function _formatFecha(fechaISO) {
  const [y, m, d] = fechaISO.split("-");
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${parseInt(d)} ${meses[parseInt(m) - 1]}`;
}

function _ajustarHora(horaStr, fechaStr) {
  const zonaOffset = getZonaHoraria(); // ya es -3 para ARG
  // Los horarios ya están en GMT-3, así que mostramos directo
  // Si el usuario cambia zona, ajustamos
  const [h, m] = horaStr.split(":").map(Number);
  const baseOffset = -3; // horarios base en GMT-3
  const diff = zonaOffset - baseOffset;
  let nuevaHora = h + diff;
  if (nuevaHora < 0) nuevaHora += 24;
  if (nuevaHora >= 24) nuevaHora -= 24;
  return `${String(nuevaHora).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}