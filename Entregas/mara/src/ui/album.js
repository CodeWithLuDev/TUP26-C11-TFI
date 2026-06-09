import { getPlantelPorEquipo } from "../data/jugadores.js";
import { EQUIPOS, getEquipoPorId } from "../data/equipos.js";

const LS_KEY = "copa_potrero_album_v1";

let _equipoActivo = null;

export function initAlbum() {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    _equipoActivo = d.equipoActivo ?? null;
  } catch { _equipoActivo = null; }

  const validos = EQUIPOS.filter(eq => getPlantelPorEquipo(eq.id)?.length > 0);
  if (!_equipoActivo && validos.length) _equipoActivo = validos[0].id;

  _renderPlantilla();
  _bindEventos();
}

function _getSelectHTML(validos) {
  const grupos = [...new Set(validos.map(e => e.grupo))].sort();
  let html = `<select id="albumEquipoSelect" class="album-desplegable-equipos">`;
  grupos.forEach(grupo => {
    html += `<optgroup label="Grupo ${grupo}">`;
    validos.filter(e => e.grupo === grupo).forEach(eq => {
      html += `<option value="${eq.id}"${_equipoActivo === eq.id ? " selected" : ""}>${eq.bandera} ${eq.nombre}</option>`;
    });
    html += `</optgroup>`;
  });
  html += `</select>`;
  return html;
}

function _renderPlantilla() {
  const c = document.getElementById("albumFiguritas");
  if (!c) return;

  const validos = EQUIPOS.filter(eq => getPlantelPorEquipo(eq.id)?.length > 0);
  const plantel = getPlantelPorEquipo(_equipoActivo);
  const equipo = getEquipoPorId(_equipoActivo);

  if (!plantel?.length) {
    c.innerHTML = `<div class="album-empty"><p>Sin jugadores cargados</p></div>`;
    return;
  }

  const gk = plantel.filter(j => j.pos === "GK").length;
  const def = plantel.filter(j => j.pos === "DEF").length;
  const mid = plantel.filter(j => j.pos === "MID").length;
  const fwd = plantel.filter(j => j.pos === "FWD").length;

  c.innerHTML = `
    <div class="album-panel">
      <aside class="album-panel__left">
        <div class="album-left__header">
          <h2 class="album-left__titulo">PLANTELES</h2>
        </div>
        <div class="album-left__selector">
          <label class="album-filtro__label">Ver plantel de:</label>
          ${_getSelectHTML(validos)}
        </div>
        <div class="album-left__identidad">
          <span class="album-left__iniciales">${_equipoActivo.slice(0, 2).toUpperCase()}</span>
          <div class="album-left__nombre-wrap">
            <span class="album-left__bandera">${equipo.bandera}</span>
            <span class="album-left__nombre">${equipo.nombre}</span>
          </div>
        </div>
        <div class="album-left__badges">
          <span class="album-badge-item">GRUPO ${equipo.grupo}</span>
          <span class="album-badge-item">${equipo.conf}</span>
        </div>
        <div class="album-left__stats">
          <div class="album-stat album-stat--full">
            <span class="album-stat__num">${plantel.length}</span>
            <span class="album-stat__label">JUGADORES</span>
          </div>
          <div class="album-stat">
            <span class="album-stat__num">${gk}</span>
            <span class="album-stat__label">ARQUEROS</span>
          </div>
          <div class="album-stat">
            <span class="album-stat__num">${def}</span>
            <span class="album-stat__label">DEFENSORES</span>
          </div>
          <div class="album-stat">
            <span class="album-stat__num">${mid}</span>
            <span class="album-stat__label">VOLANTES</span>
          </div>
          <div class="album-stat">
            <span class="album-stat__num">${fwd}</span>
            <span class="album-stat__label">DELANTEROS</span>
          </div>
        </div>
      </aside>
      <div class="album-panel__right">
        <div class="album-right__buscar">
          <svg class="album-search__icono" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="albumBuscar" class="album-buscar" placeholder="Buscar jugador por nombre..." />
        </div>
        <div id="albumBloques">
          ${_renderBloque("GK", "ARQUEROS", plantel)}
          ${_renderBloque("DEF", "DEFENSORES", plantel)}
          ${_renderBloque("MID", "VOLANTES", plantel)}
          ${_renderBloque("FWD", "DELANTEROS", plantel)}
        </div>
      </div>
    </div>
  `;

  document.getElementById("albumBuscar")?.addEventListener("input", e => {
    _filtrarJugadores(e.target.value);
  });

  document.getElementById("albumEquipoSelect")?.addEventListener("change", e => {
    _equipoActivo = e.target.value;
    try { localStorage.setItem(LS_KEY, JSON.stringify({ equipoActivo: _equipoActivo })); } catch {}
    _renderPlantilla();
  });
}

function _renderBloque(pos, label, plantel) {
  const jugadores = plantel
    .filter(j => j.pos === pos)
    .sort((a, b) => a.dorsal - b.dorsal);

  if (!jugadores.length) return "";

  return `
    <div class="album-bloque" data-pos="${pos}">
      <h3 class="album-bloque__titulo">${label} <span class="album-bloque__count">[${jugadores.length}]</span></h3>
      <div class="album-bloque__grid">
        ${jugadores.map(j => `
          <div class="album-jugador" data-nombre="${j.nombre.toLowerCase()}" data-dorsal="${j.dorsal}" tabindex="0">
            <span class="album-jugador__dorsal">${j.dorsal}</span>
            <span class="album-jugador__info">
              <span class="album-jugador__nombre">${j.nombre}</span>
              <span class="album-jugador__club">${j.club}</span>
            </span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function _filtrarJugadores(texto) {
  const q = texto.toLowerCase().trim();
  document.querySelectorAll(".album-bloque").forEach(bloque => {
    let visible = 0;
    bloque.querySelectorAll(".album-jugador").forEach(j => {
      const match = !q || j.dataset.nombre.includes(q);
      j.style.display = match ? "" : "none";
      if (match) visible++;
    });
    bloque.style.display = visible ? "" : "none";
  });
}

function _bindEventos() {
  document.getElementById("albumFiguritas")?.addEventListener("click", e => {
    const card = e.target.closest(".album-jugador");
    if (!card) return;
    const dorsal = parseInt(card.dataset.dorsal, 10);
    const plantel = getPlantelPorEquipo(_equipoActivo);
    const jugador = plantel.find(j => j.dorsal === dorsal);
    if (jugador) mostrarModalJugador(jugador);
  });
}

const POS_LABELS = { GK: "ARQUEROS", DEF: "DEFENSORES", MID: "VOLANTES", FWD: "DELANTEROS" };

export function mostrarModalJugador(jugador) {
  const existente = document.getElementById("jugadorModalOverlay");
  if (existente) existente.remove();

  const equipo = getEquipoPorId(_equipoActivo);
  const iniciales = _equipoActivo.slice(0, 2).toUpperCase();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "jugadorModalOverlay";

  overlay.innerHTML = `
    <div class="modal-jugador">
      <button class="modal-jugador__cerrar">&times;</button>
      <div class="modal-jugador__iniciales">${iniciales}</div>
      <div class="modal-jugador__dorsal">${jugador.dorsal}</div>
      <div class="modal-jugador__nombre">${jugador.nombre}</div>
      <div class="modal-jugador__club">${jugador.club}</div>
      <div class="modal-jugador__pais">${equipo?.nombre || _equipoActivo}</div>
      <div class="modal-jugador__footer">
        <div class="modal-jugador__badge">
          <span class="modal-jugador__badge-label">POSICIÓN</span>
          <span class="modal-jugador__badge-value">${POS_LABELS[jugador.pos] || jugador.pos}</span>
        </div>
        <div class="modal-jugador__badge">
          <span class="modal-jugador__badge-label">SELECCIÓN</span>
          <span class="modal-jugador__badge-value">${_equipoActivo}</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("active")));

  const cerrar = () => {
    overlay.classList.remove("active");
    overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
  };

  overlay.querySelector(".modal-jugador__cerrar").addEventListener("click", cerrar);
  overlay.addEventListener("click", e => { if (e.target === overlay) cerrar(); });

  const escapeHandler = (e) => {
    if (e.key === "Escape") { cerrar(); document.removeEventListener("keydown", escapeHandler); }
  };
  document.addEventListener("keydown", escapeHandler);
}
