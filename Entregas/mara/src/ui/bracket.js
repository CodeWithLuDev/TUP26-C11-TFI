// ═══════════════════════════════════════════════════════════
// src/ui/bracket.js
// UI del árbol de playoffs — renderiza y gestiona interacciones
// Depende de: playoffs.js (lógica), state.js (persistencia)
// ═══════════════════════════════════════════════════════════

import {
  construirBracket,
  registrarGanador,
  resetearPartido,
  isFaseGruposCompleta,
  serializarBracket,
  deserializarBracket,
} from "../logic/playoffs.js";

// ─── ESTADO LOCAL ────────────────────────────────────────
const LS_KEY = "copa_potrero_bracket_v1";

let _bracket      = null;  // Estado actual del bracket
let _modalAbierto = false;
let _partidoActivo = null; // Partido que está siendo editado

// ─── INICIALIZACIÓN ──────────────────────────────────────

export function initBracket() {
  _bracket = _cargarBracket();
  _renderBracket();
  _bindNavBtn();
}

function _cargarBracket() {
  const guardado = localStorage.getItem(LS_KEY);
  if (guardado) {
    const parsed = deserializarBracket(guardado);
    if (parsed) return parsed;
  }
  return construirBracket(null);
}

function _guardarBracket() {
  localStorage.setItem(LS_KEY, serializarBracket(_bracket));
}

// ─── RENDER PRINCIPAL ────────────────────────────────────

function _renderBracket() {
  const contenedor = document.getElementById("bracketContenido");
  if (!contenedor) return;

  const completa = isFaseGruposCompleta();

  if (!completa && !_tieneDatosReales()) {
    contenedor.innerHTML = _templateVacio();
    return;
  }

  contenedor.innerHTML = "";
  contenedor.className = "bracket-scroll";

  const rondas = [
    { key: "octavos",      titulo: "OCTAVOS DE FINAL",    cols: 2 },
    { key: "cuartos",      titulo: "CUARTOS DE FINAL",    cols: 1 },
    { key: "semifinales",  titulo: "SEMIFINALES",         cols: 1 },
    { key: "tercerPuesto", titulo: "3ER Y 4TO PUESTO",    cols: 1 },
    { key: "final",        titulo: "⭐ GRAN FINAL ⭐",     cols: 1 },
  ];

  // Los octavos se dividen en dos columnas visuales
  for (const ronda of rondas) {
    const partidos = _bracket.rondas[ronda.key];
    if (!partidos?.length) continue;

    if (ronda.key === "octavos") {
      // Split en dos mitades para el bracket
      const mitad = Math.ceil(partidos.length / 2);
      contenedor.appendChild(_crearColumnaRonda(
        "OCTAVOS (1-8)", partidos.slice(0, mitad), ronda.key
      ));
      contenedor.appendChild(_crearConector());
      contenedor.appendChild(_crearColumnaRonda(
        "CUARTOS DE FINAL", _bracket.rondas.cuartos, "cuartos"
      ));
      contenedor.appendChild(_crearConector());
      contenedor.appendChild(_crearColumnaRonda(
        "SEMIFINALES", _bracket.rondas.semifinales, "semifinales"
      ));
      contenedor.appendChild(_crearConector());

      // Columna central: Final + Campeón
      const colFinal = document.createElement("div");
      colFinal.className = "bracket-ronda bracket-ronda--final";
      colFinal.innerHTML = `
        <div class="bracket-ronda__titulo">⭐ GRAN FINAL ⭐</div>
        ${_templatePartidos(_bracket.rondas.final, "final")}
        ${_campeonTemplate()}
      `;
      contenedor.appendChild(colFinal);

      contenedor.appendChild(_crearConector());
      contenedor.appendChild(_crearColumnaRonda(
        "3ER Y 4TO PUESTO", _bracket.rondas.tercerPuesto, "tercerPuesto"
      ));
      contenedor.appendChild(_crearConector());
      contenedor.appendChild(_crearColumnaRonda(
        "OCTAVOS (9-16)", partidos.slice(mitad), ronda.key
      ));
      break; // Ya armamos todo el árbol
    }
  }

  _bindEventosBracket(contenedor);
}

function _crearColumnaRonda(titulo, partidos, key) {
  const col = document.createElement("div");
  col.className = "bracket-ronda";
  col.innerHTML = `
    <div class="bracket-ronda__titulo">${titulo}</div>
    ${_templatePartidos(partidos, key)}
  `;
  return col;
}

function _crearConector() {
  const el = document.createElement("div");
  el.className = "bracket-conector";
  el.innerHTML = `<div class="bracket-conector__linea"></div>`;
  return el;
}

function _templatePartidos(partidos, rondaKey) {
  if (!partidos?.length) return "";
  return partidos.map(p => _templatePartido(p, rondaKey)).join("");
}

function _templatePartido(partido, rondaKey) {
  const { local, visitante, estado, resolucion, ganador } = partido;
  const esJugado  = estado === "jugado";
  const enCurso   = estado === "en_curso";
  const esPendiente = estado === "pendiente";

  const claseCard = [
    "bracket-llave",
    esJugado   ? "bracket-llave--jugado"   : "",
    enCurso    ? "bracket-llave--en-curso" : "",
    esPendiente ? "bracket-llave--pendiente" : "",
  ].filter(Boolean).join(" ");

  const badgeResolucion = esJugado && resolucion !== "normal"
    ? `<span class="bracket-badge-res">${resolucion === "penales" ? "PEN" : "AET"}</span>`
    : "";

  const claseLocal     = ganador === local.equipo?.id     ? "bracket-equipo bracket-equipo--ganador" : "bracket-equipo";
  const claseVisitante = ganador === visitante.equipo?.id ? "bracket-equipo bracket-equipo--ganador" : "bracket-equipo";

  const golesLocal     = local.goles     !== null ? local.goles     : "-";
  const golesVisitante = visitante.goles !== null ? visitante.goles : "-";

  const penalesLocal     = local.penales     !== null ? `(${local.penales})`     : "";
  const penalesVisitante = visitante.penales !== null ? `(${visitante.penales})` : "";

  const accion = esJugado
    ? `<button class="bracket-btn bracket-btn--reset"  data-id="${partido.id}" title="Editar resultado">✏️</button>`
    : `<button class="bracket-btn bracket-btn--cargar" data-id="${partido.id}" title="Cargar resultado">⚽ Cargar</button>`;

  return `
    <div class="${claseCard}" data-partido="${partido.id}" data-ronda="${rondaKey}">
      <div class="bracket-llave__header">
        <span class="bracket-llave__id">${partido.id}</span>
        ${badgeResolucion}
        ${accion}
      </div>
      <div class="${claseLocal}">
        <span class="bracket-equipo__bandera">${local.equipo?.bandera ?? "🏳️"}</span>
        <span class="bracket-equipo__nombre">${local.equipo?.nombre ?? "TBD"}</span>
        <span class="bracket-equipo__goles">${golesLocal} ${penalesLocal}</span>
      </div>
      <div class="${claseVisitante}">
        <span class="bracket-equipo__bandera">${visitante.equipo?.bandera ?? "🏳️"}</span>
        <span class="bracket-equipo__nombre">${visitante.equipo?.nombre ?? "TBD"}</span>
        <span class="bracket-equipo__goles">${golesVisitante} ${penalesVisitante}</span>
      </div>
    </div>
  `;
}

function _campeonTemplate() {
  if (!_bracket?.campeon) {
    return `<div class="bracket-campeon bracket-campeon--vacio">🏆<br><span>Campeón</span></div>`;
  }
  return `
    <div class="bracket-campeon">
      <div class="bracket-campeon__trofeo">🏆</div>
      <div class="bracket-campeon__bandera">${_bracket.campeon.bandera}</div>
      <div class="bracket-campeon__nombre">${_bracket.campeon.nombre}</div>
      <div class="bracket-campeon__label">CAMPEÓN MUNDIAL 2026</div>
    </div>
  `;
}

function _templateVacio() {
  return `
    <div class="bracket-empty">
      <div class="bracket-empty__icono">🏆</div>
      <p class="bracket-empty__titulo">El bracket se habilitará al finalizar la fase de grupos</p>
      <p class="bracket-empty__sub">Completá los resultados de los 36 partidos para activar los playoffs</p>
      <button class="btn btn--primario" id="btnForzarBracket">
        Vista previa del bracket (modo demo)
      </button>
    </div>
  `;
}

// ─── EVENTOS ────────────────────────────────────────────

function _bindEventosBracket(contenedor) {
  contenedor.addEventListener("click", (e) => {
    const btnCargar = e.target.closest(".bracket-btn--cargar");
    const btnReset  = e.target.closest(".bracket-btn--reset");
    const btnForzar = e.target.closest("#btnForzarBracket");

    if (btnCargar) {
      const id = btnCargar.dataset.id;
      _abrirModalResultado(id);
    }

    if (btnReset) {
      const id = btnReset.dataset.id;
      _confirmarReset(id);
    }

    if (btnForzar) {
      _forzarBracketDemo();
    }
  });
}

function _bindNavBtn() {
  // Re-render al activar la vista bracket
  const btn = document.querySelector('[data-vista="bracket"]');
  if (btn) {
    btn.addEventListener("click", () => {
      _bracket = _cargarBracket();
      _renderBracket();
    });
  }
}

// ─── MODAL DE RESULTADO ──────────────────────────────────

function _abrirModalResultado(partidoId) {
  _partidoActivo = _encontrarPartidoEnBracket(partidoId);
  if (!_partidoActivo) return;

  _modalAbierto = true;

  // Crear modal dinámico si no existe
  let modal = document.getElementById("bracketModal");
  if (!modal) {
    modal = _crearModalDOM();
    document.body.appendChild(modal);
  }

  // Rellenar contenido
  const local     = _partidoActivo.local.equipo;
  const visitante = _partidoActivo.visitante.equipo;

  modal.querySelector(".bracket-modal__local").textContent =
    `${local?.bandera ?? "🏳️"} ${local?.nombre ?? "TBD"}`;
  modal.querySelector(".bracket-modal__visitante").textContent =
    `${visitante?.bandera ?? "🏳️"} ${visitante?.nombre ?? "TBD"}`;

  // Restaurar valores previos si existen
  modal.querySelector("#bm-goles-local").value     = _partidoActivo.local.goles     ?? "";
  modal.querySelector("#bm-goles-vis").value       = _partidoActivo.visitante.goles ?? "";
  modal.querySelector("#bm-penales-local").value   = _partidoActivo.local.penales   ?? "";
  modal.querySelector("#bm-penales-vis").value     = _partidoActivo.visitante.penales ?? "";
  modal.querySelector("#bm-resolucion").value      = _partidoActivo.resolucion ?? "normal";

  _togglePenalesUI(modal, _partidoActivo.resolucion ?? "normal");

  modal.classList.add("active");
  modal.querySelector("#bm-goles-local").focus();
}

function _crearModalDOM() {
  const modal = document.createElement("div");
  modal.id        = "bracketModal";
  modal.className = "modal-overlay bracket-modal-overlay";
  modal.innerHTML = `
    <div class="modal bracket-modal">
      <div class="modal__header">
        <h3 class="modal__titulo">⚽ RESULTADO PLAYOFF</h3>
        <button class="modal__cerrar" id="bmCerrar">✕</button>
      </div>
      <div class="modal__body">

        <!-- Equipos -->
        <div class="bracket-modal__equipos">
          <span class="bracket-modal__local"></span>
          <span class="bracket-modal__vs">VS</span>
          <span class="bracket-modal__visitante"></span>
        </div>

        <!-- Marcador -->
        <div class="bracket-modal__marcador">
          <div class="modal-campo">
            <label>Goles local</label>
            <input id="bm-goles-local" type="number" min="0" max="30" class="marcador-input" placeholder="0" />
          </div>
          <div class="marcador-vs">—</div>
          <div class="modal-campo">
            <label>Goles visitante</label>
            <input id="bm-goles-vis" type="number" min="0" max="30" class="marcador-input" placeholder="0" />
          </div>
        </div>

        <!-- Tipo de resolución -->
        <div class="modal-campo">
          <label>Resolución del partido</label>
          <select id="bm-resolucion">
            <option value="normal">Tiempo reglamentario</option>
            <option value="extratime">Prórroga (Tiempo extra)</option>
            <option value="penales">Penales</option>
          </select>
        </div>

        <!-- Penales (condicional) -->
        <div class="bracket-modal__penales" id="bmPenalesSection" style="display:none">
          <p class="bracket-modal__penales-label">🥅 Resultado en penales</p>
          <div class="bracket-modal__marcador">
            <div class="modal-campo">
              <label>Penales local</label>
              <input id="bm-penales-local" type="number" min="0" max="20" class="marcador-input" placeholder="0" />
            </div>
            <div class="marcador-vs">—</div>
            <div class="modal-campo">
              <label>Penales visitante</label>
              <input id="bm-penales-vis" type="number" min="0" max="20" class="marcador-input" placeholder="0" />
            </div>
          </div>
        </div>

        <!-- Error -->
        <p class="bracket-modal__error" id="bmError" style="display:none"></p>

        <!-- Acciones -->
        <div class="modal-acciones">
          <button class="btn btn--secundario" id="bmCancelar">Cancelar</button>
          <button class="btn btn--primario"   id="bmConfirmar">✔ Confirmar</button>
        </div>
      </div>
    </div>
  `;

  // Eventos del modal
  modal.querySelector("#bmCerrar").addEventListener("click",   () => _cerrarModal(modal));
  modal.querySelector("#bmCancelar").addEventListener("click", () => _cerrarModal(modal));
  modal.querySelector("#bmConfirmar").addEventListener("click", () => _confirmarResultado(modal));

  modal.querySelector("#bm-resolucion").addEventListener("change", (e) => {
    _togglePenalesUI(modal, e.target.value);
  });

  // Cerrar al hacer click fuera
  modal.addEventListener("click", (e) => {
    if (e.target === modal) _cerrarModal(modal);
  });

  // Enter para confirmar
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Enter") _confirmarResultado(modal);
    if (e.key === "Escape") _cerrarModal(modal);
  });

  return modal;
}

function _togglePenalesUI(modal, resolucion) {
  const seccion = modal.querySelector("#bmPenalesSection");
  if (seccion) {
    seccion.style.display = resolucion === "penales" ? "block" : "none";
  }
}

function _confirmarResultado(modal) {
  if (!_partidoActivo) return;

  const golesLocal     = parseInt(modal.querySelector("#bm-goles-local").value);
  const golesVisitante = parseInt(modal.querySelector("#bm-goles-vis").value);
  const resolucion     = modal.querySelector("#bm-resolucion").value;
  const penalesLocal   = parseInt(modal.querySelector("#bm-penales-local").value) || null;
  const penalesVis     = parseInt(modal.querySelector("#bm-penales-vis").value)   || null;
  const errorEl        = modal.querySelector("#bmError");

  // Validaciones
  if (isNaN(golesLocal) || isNaN(golesVisitante)) {
    _mostrarError(errorEl, "Ingresá los goles de ambos equipos.");
    return;
  }

  if (golesLocal < 0 || golesVisitante < 0) {
    _mostrarError(errorEl, "Los goles no pueden ser negativos.");
    return;
  }

  if (resolucion === "penales") {
    if (golesLocal !== golesVisitante) {
      _mostrarError(errorEl, "Si hay penales, el marcador en 90' debe estar empatado.");
      return;
    }
    if (penalesLocal === null || penalesVis === null) {
      _mostrarError(errorEl, "Ingresá el resultado de los penales.");
      return;
    }
    if (penalesLocal === penalesVis) {
      _mostrarError(errorEl, "Los penales no pueden terminar empatados.");
      return;
    }
  }

  errorEl.style.display = "none";

  // Actualizar bracket
  _bracket = registrarGanador(_bracket, _partidoActivo.id, {
    golesLocal,
    golesVisitante,
    resolucion,
    penalesLocal,
    penalesVisitante: penalesVis,
  });

  _guardarBracket();
  _cerrarModal(modal);
  _renderBracket();

  // Animación de celebración si hay campeón
  if (_bracket.campeon) {
    _celebrarCampeon();
  }
}

function _mostrarError(el, msg) {
  el.textContent    = msg;
  el.style.display  = "block";
  el.style.animation = "none";
  el.offsetHeight;  // reflow
  el.style.animation = "";
}

function _cerrarModal(modal) {
  modal.classList.remove("active");
  _modalAbierto    = false;
  _partidoActivo   = null;
}

function _confirmarReset(partidoId) {
  if (!confirm(`¿Resetear el resultado de ${partidoId}? Esto también limpiará los partidos siguientes.`)) return;
  _bracket = resetearPartido(_bracket, partidoId);
  _guardarBracket();
  _renderBracket();
}

// ─── HELPERS ────────────────────────────────────────────

function _encontrarPartidoEnBracket(id) {
  for (const ronda of Object.values(_bracket.rondas)) {
    if (!Array.isArray(ronda)) continue;
    const p = ronda.find(p => p.id === id);
    if (p) return p;
  }
  return null;
}

function _tieneDatosReales() {
  // El bracket tiene datos si al menos un partido tiene un ganador
  for (const ronda of Object.values(_bracket?.rondas ?? {})) {
    if (!Array.isArray(ronda)) continue;
    if (ronda.some(p => p.ganador)) return true;
  }
  return false;
}

function _forzarBracketDemo() {
  // Modo demo: construir bracket con los datos actuales aunque no esté completa la fase de grupos
  _bracket = construirBracket(null);
  _guardarBracket();
  _renderBracket();
}

function _celebrarCampeon() {
  const cel = document.getElementById("celebracion");
  if (!cel) return;

  const colores = ["#c9a84c","#e8c96a","#ffffff","#74b9ff","#2ecc71"];
  const cantidad = 80;

  for (let i = 0; i < cantidad; i++) {
    const papel     = document.createElement("div");
    papel.className = "papel";
    papel.style.cssText = [
      `left: ${Math.random() * 100}%`,
      `background: ${colores[Math.floor(Math.random() * colores.length)]}`,
      `--dur: ${1.5 + Math.random() * 2}s`,
      `--drift: ${(Math.random() - 0.5) * 200}px`,
      `animation-delay: ${Math.random() * 0.8}s`,
    ].join(";");
    cel.appendChild(papel);
  }

  setTimeout(() => { cel.innerHTML = ""; }, 4000);
}

// ─── RESET TOTAL (para testing) ─────────────────────────

export function resetBracketCompleto() {
  localStorage.removeItem(LS_KEY);
  _bracket = construirBracket(null);
  _renderBracket();
}