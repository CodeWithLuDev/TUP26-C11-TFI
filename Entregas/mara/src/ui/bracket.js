import {
  construirBracket, registrarGanador,
  resetearPartido, isFaseGruposCompleta,
  serializarBracket, deserializarBracket,
} from "../logic/playoffs.js";

const LS_KEY = "copa_potrero_bracket_v1";
let _bracket = null;
let _partidoActivo = null;

// ─── INIT ─────────────────────────────────────────────────
export function initBracket() {
  _bracket = _cargarBracket();

  // Re-render cada vez que se navega al bracket
  document.querySelector('[data-vista="bracket"]')
    ?.addEventListener("click", () => {
      _bracket = _cargarBracket();
      _renderBracket();
    });
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

// ─── RENDER PRINCIPAL ─────────────────────────────────────
export function renderBracket() { _renderBracket(); }

function _renderBracket() {
  const contenedor = document.getElementById("bracketContenido");
  if (!contenedor) return;

  const completa = isFaseGruposCompleta();
  const tieneData = _tieneDatosReales();

  if (!completa && !tieneData) {
    contenedor.className = "";
    contenedor.innerHTML = `
      <div class="bracket-empty">
        <div class="bracket-empty__icono">🏆</div>
        <p class="bracket-empty__titulo">El bracket se habilitará al finalizar la fase de grupos</p>
        <p class="bracket-empty__sub">Cargá los 36 resultados para activar los playoffs</p>
        <button class="btn btn--primario" id="btnForzarBracket" style="margin-top:1.5rem;max-width:300px">
          ⚡ Vista previa (modo demo)
        </button>
      </div>
    `;
    contenedor.querySelector("#btnForzarBracket")
      ?.addEventListener("click", () => {
        _bracket = construirBracket(null);
        _guardarBracket();
        _renderBracket();
      });
    return;
  }

  contenedor.className = "bracket-scroll";
  contenedor.innerHTML = "";

  // Estructura: R16izq | conector | QF | conector | SF | conector | FINAL/CAMPEON | conector | SF | conector | QF | conector | R16der
  const r = _bracket.rondas;
  const mitad = Math.ceil(r.octavos.length / 2);

  contenedor.appendChild(_columna("OCTAVOS (1–8)", r.octavos.slice(0, mitad), "octavos"));
  contenedor.appendChild(_conector());
  contenedor.appendChild(_columna("CUARTOS", r.cuartos.slice(0, 4), "cuartos"));
  contenedor.appendChild(_conector());
  contenedor.appendChild(_columna("SEMIFINALES", r.semifinales.slice(0, 2), "semifinales"));
  contenedor.appendChild(_conector());

  // Columna central: Final + Campeón + 3er Puesto
  const colCentral = document.createElement("div");
  colCentral.className = "bracket-ronda bracket-ronda--central";
  colCentral.innerHTML = `
    <div class="bracket-ronda__titulo">⭐ GRAN FINAL</div>
    ${r.final.map(p => _cardPartido(p, "final")).join("")}
    ${_campeonHTML()}
    <div class="bracket-ronda__titulo" style="margin-top:2rem">3ER PUESTO</div>
    ${r.tercerPuesto.map(p => _cardPartido(p, "tercerPuesto")).join("")}
  `;
  contenedor.appendChild(colCentral);

  contenedor.appendChild(_conector());
  contenedor.appendChild(_columna("SEMIFINALES", r.semifinales.slice(2, 4), "semifinales"));
  contenedor.appendChild(_conector());
  contenedor.appendChild(_columna("CUARTOS", r.cuartos.slice(4, 8), "cuartos"));
  contenedor.appendChild(_conector());
  contenedor.appendChild(_columna("OCTAVOS (9–16)", r.octavos.slice(mitad), "octavos"));

  _bindEventos(contenedor);
}

// ─── COLUMNA DE RONDA ─────────────────────────────────────
function _columna(titulo, partidos, rondaKey) {
  const col = document.createElement("div");
  col.className = "bracket-ronda";
  col.innerHTML = `
    <div class="bracket-ronda__titulo">${titulo}</div>
    ${partidos.map(p => _cardPartido(p, rondaKey)).join("")}
  `;
  return col;
}

function _conector() {
  const el = document.createElement("div");
  el.className = "bracket-conector";
  el.innerHTML = `
    <svg width="24" height="100%" viewBox="0 0 24 100" preserveAspectRatio="none">
      <path d="M0,50 C12,50 12,50 24,50" stroke="rgba(201,168,76,0.4)" stroke-width="1.5" fill="none"/>
    </svg>
  `;
  return el;
}

// ─── CARD DE PARTIDO ──────────────────────────────────────
function _cardPartido(partido, rondaKey) {
  const { local, visitante, estado, resolucion, ganador, id } = partido;
  const jugado = estado === "jugado";
  const pendiente = estado === "pendiente";

  const claseCard = `bracket-llave ${jugado ? "bracket-llave--jugado" : ""} ${pendiente && !local.equipo?.nombre?.includes("TBD") ? "bracket-llave--activo" : ""}`;

  const badge = jugado && resolucion !== "normal"
    ? `<span class="bracket-badge">${resolucion === "penales" ? "PEN" : "AET"}</span>` : "";

  const boton = jugado
    ? `<button class="bracket-btn-mini bracket-btn--edit" data-id="${id}">✏️</button>`
    : `<button class="bracket-btn-mini bracket-btn--play" data-id="${id}">▶</button>`;

  return `
    <div class="${claseCard}" data-id="${id}">
      <div class="bracket-llave__top">
        <span class="bracket-llave__id">${id}</span>
        ${badge}
        ${boton}
      </div>
      ${_equipoFila(local, ganador, jugado, true)}
      ${_equipoFila(visitante, ganador, jugado, false)}
    </div>
  `;
}

function _equipoFila(lado, ganador, jugado, esLocal) {
  const eq = lado.equipo;
  const esTBD = !eq || eq.id === "TBD" || eq.nombre?.startsWith("TBD");
  const esGanador = jugado && ganador === eq?.id;

  const goles = lado.goles !== null ? lado.goles : "–";
  const pen = lado.penales !== null ? `<span class="bracket-penales">(${lado.penales})</span>` : "";

  return `
    <div class="bracket-equipo ${esGanador ? "bracket-equipo--ganador" : ""} ${esTBD ? "bracket-equipo--tbd" : ""}">
      <span class="bracket-equipo__bandera">${esTBD ? "🏳️" : (eq?.bandera ?? "🏳️")}</span>
      <span class="bracket-equipo__nombre">${esTBD ? "Por definir" : (eq?.nombre ?? "?")}</span>
      <span class="bracket-equipo__goles">${goles}${pen}</span>
    </div>
  `;
}

function _campeonHTML() {
  if (!_bracket?.campeon) {
    return `
      <div class="bracket-campeon bracket-campeon--vacio">
        <span>🏆</span>
        <span>CAMPEÓN</span>
      </div>
    `;
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

// ─── MODAL DE RESULTADO ───────────────────────────────────
function _bindEventos(contenedor) {
  contenedor.addEventListener("click", e => {
    const btnPlay = e.target.closest(".bracket-btn--play");
    const btnEdit = e.target.closest(".bracket-btn--edit");
    if (btnPlay) _abrirModal(btnPlay.dataset.id);
    if (btnEdit) _abrirModal(btnEdit.dataset.id);
  });
}

function _abrirModal(partidoId) {
  _partidoActivo = _buscarPartido(partidoId);
  if (!_partidoActivo) return;

  let overlay = document.getElementById("bracketModalOverlay");
  if (!overlay) {
    overlay = _crearModal();
    document.body.appendChild(overlay);
  }

  const p = _partidoActivo;
  overlay.querySelector(".bm-local-nombre").textContent =
    `${p.local.equipo?.bandera ?? "🏳️"} ${p.local.equipo?.nombre ?? "TBD"}`;
  overlay.querySelector(".bm-vis-nombre").textContent =
    `${p.visitante.equipo?.bandera ?? "🏳️"} ${p.visitante.equipo?.nombre ?? "TBD"}`;

  overlay.querySelector("#bmGolesL").value = p.local.goles ?? "";
  overlay.querySelector("#bmGolesV").value = p.visitante.goles ?? "";
  overlay.querySelector("#bmPenL").value = p.local.penales ?? "";
  overlay.querySelector("#bmPenV").value = p.visitante.penales ?? "";
  overlay.querySelector("#bmResol").value = p.resolucion ?? "normal";
  overlay.querySelector("#bmError").style.display = "none";

  _togglePen(overlay, p.resolucion ?? "normal");
  overlay.classList.add("active");
  overlay.querySelector("#bmGolesL").focus();
}

function _crearModal() {
  const overlay = document.createElement("div");
  overlay.id = "bracketModalOverlay";
  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <h3 class="modal__titulo">⚽ RESULTADO PLAYOFF</h3>
        <button class="modal__cerrar" id="bmCerrar">✕</button>
      </div>
      <div class="modal__body">
        <div style="display:flex;align-items:center;justify-content:center;gap:1rem;margin-bottom:1.2rem;flex-wrap:wrap">
          <strong class="bm-local-nombre"></strong>
          <span style="color:var(--tiza-sucia);font-family:var(--font-titulo)">VS</span>
          <strong class="bm-vis-nombre"></strong>
        </div>

        <div class="modal-marcador">
          <div class="modal-campo" style="text-align:center">
            <label>Local</label>
            <input id="bmGolesL" type="number" min="0" max="30" class="marcador-input" placeholder="0"/>
          </div>
          <span class="marcador-vs">—</span>
          <div class="modal-campo" style="text-align:center">
            <label>Visitante</label>
            <input id="bmGolesV" type="number" min="0" max="30" class="marcador-input" placeholder="0"/>
          </div>
        </div>

        <div class="modal-campo" style="margin-bottom:1rem">
          <label>Resolución</label>
          <select id="bmResol">
            <option value="normal">Tiempo reglamentario</option>
            <option value="extratime">Prórroga (AET)</option>
            <option value="penales">Penales</option>
          </select>
        </div>

        <div id="bmPenSection" style="display:none;margin-bottom:1rem">
          <p style="font-family:var(--font-tiza);font-size:0.8rem;color:var(--oro-claro);margin-bottom:0.5rem">
            🥅 Resultado en penales
          </p>
          <div class="modal-marcador">
            <div class="modal-campo" style="text-align:center">
              <label>Penales local</label>
              <input id="bmPenL" type="number" min="0" max="20" class="marcador-input" placeholder="0"/>
            </div>
            <span class="marcador-vs">—</span>
            <div class="modal-campo" style="text-align:center">
              <label>Penales visit.</label>
              <input id="bmPenV" type="number" min="0" max="20" class="marcador-input" placeholder="0"/>
            </div>
          </div>
        </div>

        <p id="bmError" style="display:none;color:var(--rojo-claro);font-family:var(--font-tiza);font-size:0.85rem;margin-bottom:0.8rem"></p>

        <div class="modal-acciones">
          <button class="btn btn--secundario" id="bmCancelar">Cancelar</button>
          <button class="btn btn--primario"   id="bmConfirmar">✔ Confirmar</button>
        </div>
      </div>
    </div>
  `;

  overlay.querySelector("#bmCerrar").addEventListener("click", () => _cerrarModal(overlay));
  overlay.querySelector("#bmCancelar").addEventListener("click", () => _cerrarModal(overlay));
  overlay.querySelector("#bmConfirmar").addEventListener("click", () => _confirmar(overlay));
  overlay.querySelector("#bmResol").addEventListener("change", e => _togglePen(overlay, e.target.value));
  overlay.addEventListener("click", e => { if (e.target === overlay) _cerrarModal(overlay); });
  overlay.addEventListener("keydown", e => {
    if (e.key === "Escape") _cerrarModal(overlay);
    if (e.key === "Enter") _confirmar(overlay);
  });

  return overlay;
}

function _togglePen(overlay, resol) {
  overlay.querySelector("#bmPenSection").style.display =
    resol === "penales" ? "block" : "none";
}

function _confirmar(overlay) {
  if (!_partidoActivo) return;

  const gl = parseInt(overlay.querySelector("#bmGolesL").value);
  const gv = parseInt(overlay.querySelector("#bmGolesV").value);
  const resol = overlay.querySelector("#bmResol").value;
  const pl = parseInt(overlay.querySelector("#bmPenL").value) || null;
  const pv = parseInt(overlay.querySelector("#bmPenV").value) || null;
  const errEl = overlay.querySelector("#bmError");

  // Validaciones
  if (isNaN(gl) || isNaN(gv) || gl < 0 || gv < 0) {
    errEl.textContent = "Ingresá marcadores válidos.";
    errEl.style.display = "block";
    return;
  }
  if (resol === "penales") {
    if (gl !== gv) {
      errEl.textContent = "Con penales, el marcador en 90' debe estar empatado.";
      errEl.style.display = "block";
      return;
    }
    if (pl === null || pv === null || pl === pv) {
      errEl.textContent = "Ingresá penales válidos (no pueden empatar).";
      errEl.style.display = "block";
      return;
    }
  }

  _bracket = registrarGanador(_bracket, _partidoActivo.id, {
    golesLocal: gl, golesVisitante: gv,
    resolucion: resol, penalesLocal: pl, penalesVisitante: pv,
  });

  _guardarBracket();
  _cerrarModal(overlay);
  _renderBracket();

  if (_bracket.campeon) _celebrar();
}

function _cerrarModal(overlay) {
  overlay.classList.remove("active");
  _partidoActivo = null;
}

// ─── HELPERS ──────────────────────────────────────────────
function _buscarPartido(id) {
  for (const ronda of Object.values(_bracket?.rondas ?? {})) {
    if (!Array.isArray(ronda)) continue;
    const p = ronda.find(p => p.id === id);
    if (p) return p;
  }
  return null;
}

function _tieneDatosReales() {
  for (const ronda of Object.values(_bracket?.rondas ?? {})) {
    if (!Array.isArray(ronda)) continue;
    if (ronda.some(p => p.ganador)) return true;
  }
  return false;
}

function _celebrar() {
  const cel = document.getElementById("celebracion");
  if (!cel) return;
  const colores = ["#c9a84c", "#e8c96a", "#fff", "#74b9ff", "#2ecc71"];
  for (let i = 0; i < 100; i++) {
    const p = document.createElement("div");
    p.className = "papel";
    p.style.cssText = `left:${Math.random() * 100}%;background:${colores[i % colores.length]};--dur:${1.5 + Math.random() * 2}s;--drift:${(Math.random() - .5) * 200}px;animation-delay:${Math.random() * .8}s`;
    cel.appendChild(p);
  }
  setTimeout(() => { cel.innerHTML = ""; }, 4500);
}

export function resetBracketCompleto() {
  localStorage.removeItem(LS_KEY);
  _bracket = construirBracket(null);
  _renderBracket();
}