import { PARTIDOS, getPartidosHoy, FECHAS } from "../data/partidos.js";
import { getEquipoPorId } from "../data/equipos.js";
import { getResultadoPartido } from "../logic/state.js";
import { getZonaHoraria } from "../logic/state.js";
import { abrirModalResultado } from "./modal.js";

const contenedor = () => document.getElementById("fixtureContenido");

let filtroActivo = "hoy";
let _filtroBusqueda = "";
let _filtroSede = "";

function _getSedes() {
  return [...new Set(PARTIDOS.map(p => p.sede.split(",")[0].trim()))].sort();
}

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

  _filtroBusqueda = "";
  _filtroSede = "";

  let partidos = [];

  if (filtro === "hoy") {
    partidos = getPartidosHoy();
    if (partidos.length === 0) {
      const hoy = new Date().toISOString().split("T")[0];
      partidos = PARTIDOS.filter(p => p.fecha >= hoy).slice(0, 8);
    }
  } else if (filtro === "fecha") {
    partidos = _getPartidosPorFechaAgrupados();
  } else if (filtro === "grupo") {
    partidos = _getPartidosPorGrupoAgrupados();
  }

  el.innerHTML = `
    <div class="fixture-filtros-secundarios">
      <input type="text" id="fixtureBuscar" class="fixture-input" placeholder="🔍 Buscar equipo..." />
      <select id="fixtureSede" class="fixture-select">
        <option value="">📍 Todas las sedes</option>
        ${_getSedes().map(s => `<option value="${s}">${s}</option>`).join("")}
      </select>
    </div>
    <div id="fixtureLista">
      ${_renderLista(partidos, filtro)}
    </div>
  `;

  _bindFiltrosSecundarios();
}

function _renderLista(partidos, filtro) {
  if (filtro === "fecha") return _renderAgrupado(partidos, "fecha");
  if (filtro === "grupo") return _renderAgrupado(partidos, "grupo");

  if (!partidos.length) {
    return `<div class="placeholder-tiza"><p>No hay partidos programados para hoy</p></div>`;
  }
  return partidos.map(p => _renderPartidoCard(p)).join("");
}

function _bindFiltrosSecundarios() {
  document.getElementById("fixtureBuscar")?.addEventListener("input", e => {
    _filtroBusqueda = e.target.value;
    _filtrarPartidos();
  });
  document.getElementById("fixtureSede")?.addEventListener("change", e => {
    _filtroSede = e.target.value;
    _filtrarPartidos();
  });
  attachFixtureListeners();
}

function _filtrarPartidos() {
  const q = _filtroBusqueda.toLowerCase().trim();
  const sede = _filtroSede;
  document.querySelectorAll("#fixtureLista .partido-card").forEach(card => {
    const texto = card.dataset.busqueda || "";
    const cardSede = card.dataset.sede || "";
    const matchTexto = !q || texto.includes(q);
    const matchSede = !sede || cardSede === sede;
    card.style.display = matchTexto && matchSede ? "" : "none";
  });
  // Ocultar headers de grupo que quedan vacíos
  document.querySelectorAll("#fixtureLista .fixture-grupo-header").forEach(h => {
    let next = h.nextElementSibling;
    let visible = false;
    while (next && !next.classList.contains("fixture-grupo-header")) {
      if (next.style.display !== "none") { visible = true; break; }
      next = next.nextElementSibling;
    }
    h.style.display = visible ? "" : "none";
  });
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
function _esAhora(p, hora) {
  const hoy = new Date().toISOString().split("T")[0];
  if (p.fecha !== hoy) return false;
  const ahora = new Date();
  const [hh, mm] = hora.split(":").map(Number);
  const minutosPartido = hh * 60 + mm;
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const diff = minutosPartido - minutosAhora;
  return diff <= 0 && diff > -105; // empezó hace menos de 105 min
}

function _renderPartidoCard(p) {
  const eqL = getEquipoPorId(p.local);
  const eqV = getEquipoPorId(p.visitante);
  const res = getResultadoPartido(p.id);
  const hora = _ajustarHora(p.hora, p.fecha);

  const claseCard = res?.jugado ? "jugado" : "";
  const enVivo = !res?.jugado && _esAhora(p, hora);

  const resultado = res?.jugado
    ? `<span class="partido-resultado">${res.local} — ${res.visitante}</span>`
    : `<span class="partido-vs">${enVivo ? "🔴 EN VIVO" : hora}</span>`;

  const busqueda = [eqL?.nombre, eqV?.nombre, p.local, p.visitante, p.grupo].filter(Boolean).join(" ").toLowerCase();

  return `
    <div class="partido-card ${claseCard} ${enVivo ? "en-curso" : ""}" data-partido="${p.id}" data-busqueda="${busqueda}" data-sede="${p.sede.split(",")[0].trim()}">
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
        <span>${_formatFecha(p.fecha)} ${enVivo ? "· 🔴" : ""}</span>
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