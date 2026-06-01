// ═══════════════════════════════════════════════════════════
// src/ui/album.js
// Álbum Panini Potrero '26
// Mecánica: sobres con animación de apertura + flip cards
// Persistencia: LocalStorage
// ═══════════════════════════════════════════════════════════

import { JUGADORES, getPlantelPorEquipo } from "../data/jugadores.js";
import { EQUIPOS, getEquipoPorId }        from "../data/equipos.js";

// ─── CONSTANTES ──────────────────────────────────────────
const LS_KEY_ALBUM   = "copa_potrero_album_v1";
const LS_KEY_DIARIO  = "copa_potrero_album_diario_v1";

// Cuántas figuritas trae cada sobre
const FIGURITAS_POR_SOBRE = 5;

// Cooldown: 1 sobre por día (en ms)
const COOLDOWN_DIARIO_MS = 24 * 60 * 60 * 1000;

// Posiciones con emoji
const POS_EMOJI = { GK: "🧤", DEF: "🛡️", MID: "⚡", FWD: "🎯" };

// ─── ESTADO ──────────────────────────────────────────────
let _figuritasConseguidas = new Set(); // Set de IDs de figuritas desbloqueadas
let _equipoActivo         = null;      // ID del equipo filtrado actualmente
let _sobreAbierto         = false;     // Flag para evitar doble apertura

// ─── INICIALIZACIÓN ──────────────────────────────────────

export function initAlbum() {
  _cargarEstado();
  _renderFiltroEscudos();
  _renderSeccionSobre();
  _renderFiguritas();
  _bindEventos();
}

// ─── PERSISTENCIA ────────────────────────────────────────

function _cargarEstado() {
  try {
    const guardado = localStorage.getItem(LS_KEY_ALBUM);
    if (guardado) {
      const data = JSON.parse(guardado);
      _figuritasConseguidas = new Set(data.figuritas ?? []);
      _equipoActivo = data.equipoActivo ?? null;
    }
  } catch {
    _figuritasConseguidas = new Set();
    _equipoActivo = null;
  }
}

function _guardarEstado() {
  localStorage.setItem(LS_KEY_ALBUM, JSON.stringify({
    figuritas:    [..._figuritasConseguidas],
    equipoActivo: _equipoActivo,
  }));
}

function _getEstadoDiario() {
  try {
    const raw = localStorage.getItem(LS_KEY_DIARIO);
    return raw ? JSON.parse(raw) : { ultimaApertura: null };
  } catch {
    return { ultimaApertura: null };
  }
}

function _setEstadoDiario(ts) {
  localStorage.setItem(LS_KEY_DIARIO, JSON.stringify({ ultimaApertura: ts }));
}

function _puedeAbrirSobre() {
  const { ultimaApertura } = _getEstadoDiario();
  if (!ultimaApertura) return true;
  return Date.now() - ultimaApertura >= COOLDOWN_DIARIO_MS;
}

function _tiempoRestanteSobre() {
  const { ultimaApertura } = _getEstadoDiario();
  if (!ultimaApertura) return 0;
  const restante = COOLDOWN_DIARIO_MS - (Date.now() - ultimaApertura);
  return Math.max(0, restante);
}

// ─── RENDER FILTRO ESCUDOS ───────────────────────────────

function _renderFiltroEscudos() {
  const contenedor = document.getElementById("albumEscudos");
  if (!contenedor) return;

  // Botón "Todos"
  contenedor.innerHTML = `
    <button class="escudo-btn ${!_equipoActivo ? "active" : ""}"
            data-equipo="TODOS"
            title="Ver todos">🌍</button>
  `;

  // Un botón por equipo que tenga jugadores
  for (const [id, equipo] of Object.entries(EQUIPOS)) {
    if (!getPlantelPorEquipo(id)?.length) continue;
    const activo = _equipoActivo === id ? "active" : "";
    contenedor.innerHTML += `
      <button class="escudo-btn ${activo}"
              data-equipo="${id}"
              title="${equipo.nombre}">
        ${equipo.bandera}
      </button>
    `;
  }
}

// ─── SECCIÓN DEL SOBRE ───────────────────────────────────

function _renderSeccionSobre() {
  // Buscar o crear la sección del sobre
  let seccion = document.getElementById("albumSobreSection");
  if (!seccion) {
    seccion = document.createElement("div");
    seccion.id = "albumSobreSection";
    seccion.className = "album-sobre-section";

    const albumSection = document.querySelector(".album-section");
    if (!albumSection) return;

    const header = albumSection.querySelector(".album-section__header");
    header?.after(seccion);
  }

  const puede    = _puedeAbrirSobre();
  const restante = puede ? 0 : _tiempoRestanteSobre();
  const totalFigs = _contarTotalFiguritas();
  const progreso  = totalFigs > 0
    ? Math.round((_figuritasConseguidas.size / totalFigs) * 100)
    : 0;

  seccion.innerHTML = `
    <div class="album-progreso">
      <div class="album-progreso__texto">
        <span class="album-progreso__num">${_figuritasConseguidas.size}</span>
        <span class="album-progreso__sep">/</span>
        <span class="album-progreso__total">${totalFigs}</span>
        <span class="album-progreso__label">figuritas conseguidas</span>
      </div>
      <div class="album-progreso__barra">
        <div class="album-progreso__fill" style="width: ${progreso}%">
          <span class="album-progreso__pct">${progreso}%</span>
        </div>
      </div>
    </div>

    <div class="album-sobre-wrapper">
      <div class="album-sobre ${puede ? "album-sobre--disponible" : "album-sobre--agotado"}"
           id="albumSobre"
           role="button"
           aria-label="${puede ? "Abrir sobre de figuritas" : "Sobre no disponible aún"}"
           tabindex="0">
        <div class="album-sobre__frente">
          <div class="album-sobre__logo">⚽</div>
          <div class="album-sobre__titulo">POTRERO '26</div>
          <div class="album-sobre__sub">COLECCIÓN OFICIAL</div>
          <div class="album-sobre__estrellas">★ ★ ★ ★ ★</div>
          ${puede
            ? `<div class="album-sobre__cta">¡ABRÍ EL SOBRE!</div>`
            : `<div class="album-sobre__countdown" id="sobreCountdown">${_formatTiempo(restante)}</div>`
          }
        </div>
        <div class="album-sobre__brillo"></div>
      </div>

      <div class="album-sobre-info">
        <p class="album-sobre-info__texto">
          ${puede
            ? `🎁 <strong>¡Hay un sobre disponible!</strong> Abrilo para conseguir ${FIGURITAS_POR_SOBRE} figuritas.`
            : `⏳ El próximo sobre estará disponible en <strong id="sobreTimerTexto">${_formatTiempo(restante)}</strong>`
          }
        </p>
      </div>
    </div>

    <!-- Contenedor donde aparecen las figuritas del sobre abierto -->
    <div class="album-sobre-resultado" id="albumSobreResultado"></div>
  `;

  // Timer en tiempo real
  if (!puede) {
    _iniciarCountdown();
  }
}

function _iniciarCountdown() {
  const interval = setInterval(() => {
    const restante = _tiempoRestanteSobre();
    const countdown = document.getElementById("sobreCountdown");
    const timerTexto = document.getElementById("sobreTimerTexto");
    if (countdown)   countdown.textContent  = _formatTiempo(restante);
    if (timerTexto)  timerTexto.textContent = _formatTiempo(restante);

    if (restante <= 0) {
      clearInterval(interval);
      _renderSeccionSobre(); // re-render para habilitar el sobre
    }
  }, 1000);
}

function _formatTiempo(ms) {
  if (ms <= 0) return "¡Ya disponible!";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000)   / 1000);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

// ─── RENDER FIGURITAS ────────────────────────────────────

function _renderFiguritas() {
  const contenedor = document.getElementById("albumFiguritas");
  if (!contenedor) return;

  const plantel = _equipoActivo
    ? getPlantelPorEquipo(_equipoActivo)
    : _getTodoElPlantel();

  if (!plantel?.length) {
    contenedor.innerHTML = `
      <div class="album-empty">
        <div class="album-empty__icono">📭</div>
        <p>No hay jugadores para mostrar</p>
      </div>
    `;
    return;
  }

  // Separar conseguidas vs faltantes
  const conseguidas = plantel.filter(j => _figuritasConseguidas.has(_figId(j)));
  const faltantes   = plantel.filter(j => !_figuritasConseguidas.has(_figId(j)));

  contenedor.innerHTML = "";

  // Primero conseguidas, luego las "en blanco"
  [...conseguidas, ...faltantes].forEach((jugador, idx) => {
    const el = _crearFigurita(jugador, idx);
    contenedor.appendChild(el);
  });
}

function _crearFigurita(jugador, idx) {
  const id          = _figId(jugador);
  const conseguida  = _figuritasConseguidas.has(id);
  const equipo      = getEquipoPorId(jugador.equipoId) ?? {};
  const posEmoji    = POS_EMOJI[jugador.pos] ?? "⚽";

  const wrapper = document.createElement("div");
  wrapper.className = "figurita-wrapper";
  wrapper.style.animationDelay = `${Math.min(idx * 0.03, 0.6)}s`;

  wrapper.innerHTML = `
    <div class="figurita ${conseguida ? "figurita--conseguida" : "figurita--vacia"}"
         data-id="${id}"
         title="${conseguida ? jugador.nombre : "Sin conseguir"}">

      <!-- Cara frontal -->
      <div class="figurita__front">
        <div class="figurita__header" style="background: ${equipo.colorPrimario ?? "var(--verde-claro)"}">
          <span class="figurita__numero">#${jugador.dorsal}</span>
          <span class="figurita__pos-badge">${jugador.pos} ${posEmoji}</span>
        </div>
        <div class="figurita__foto">
          ${conseguida ? (equipo.bandera ?? "🏳️") : "❓"}
        </div>
        <div class="figurita__info">
          <div class="figurita__nombre">${conseguida ? jugador.nombre : "???"}</div>
          <div class="figurita__club">${conseguida ? (jugador.club ?? "")  : "Falta conseguir"}</div>
        </div>
        <div class="figurita__equipo-badge">
          ${equipo.bandera ?? ""} ${conseguida ? (equipo.nombre ?? jugador.equipoId ?? "") : ""}
        </div>
      </div>

      <!-- Efecto brillo al hover -->
      <div class="figurita__brillo"></div>
    </div>
  `;

  return wrapper;
}

// ─── APERTURA DE SOBRE ───────────────────────────────────

function _abrirSobre() {
  if (_sobreAbierto || !_puedeAbrirSobre()) return;
  _sobreAbierto = true;

  const sobre = document.getElementById("albumSobre");
  if (!sobre) return;

  sobre.classList.add("album-sobre--abriendo");

  // Animación de apertura: 600ms
  setTimeout(() => {
    const nuevas = _sortearFiguritas();
    _setEstadoDiario(Date.now());
    _guardarEstado();

    sobre.classList.remove("album-sobre--abriendo");
    _renderSeccionSobre();      // Actualiza el sobre (ahora agotado)
    _renderFiguritas();         // Actualiza el álbum
    _mostrarFiguritasNuevas(nuevas);

    _sobreAbierto = false;
  }, 600);
}

function _sortearFiguritas() {
  // Obtener todas las figuritas NO conseguidas
  const todas      = _getTodoElPlantel();
  const faltantes  = todas.filter(j => !_figuritasConseguidas.has(_figId(j)));

  if (!faltantes.length) {
    // Álbum completo: dar figuritas repetidas (no se guardan)
    return _pickAleatorio(todas, FIGURITAS_POR_SOBRE);
  }

  // Pesar más las faltantes (80% faltantes, 20% repetidas si quedan pocas)
  const cantidad   = Math.min(FIGURITAS_POR_SOBRE, faltantes.length);
  const sorteadas  = _pickAleatorio(faltantes, cantidad);

  // Guardar las nuevas
  sorteadas.forEach(j => _figuritasConseguidas.add(_figId(j)));

  return sorteadas;
}

function _mostrarFiguritasNuevas(jugadores) {
  const contenedor = document.getElementById("albumSobreResultado");
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="sobre-resultado">
      <h3 class="sobre-resultado__titulo">🎉 ¡Figuritas conseguidas!</h3>
      <div class="sobre-resultado__grid" id="sobreResultadoGrid"></div>
      <button class="btn btn--primario sobre-resultado__btn" id="btnVerAlbum">
        Ver en el álbum ↓
      </button>
    </div>
  `;

  const grid = contenedor.querySelector("#sobreResultadoGrid");

  jugadores.forEach((jugador, idx) => {
    const equipo     = getEquipoPorId(jugador.equipoId) ?? {};
    const posEmoji   = POS_EMOJI[jugador.pos] ?? "⚽";
    const card       = document.createElement("div");
    card.className   = "sobre-fig-nueva";
    card.style.animationDelay = `${idx * 0.15}s`;

    card.innerHTML = `
      <div class="sobre-fig-nueva__inner">
        <!-- Cara oculta (reverso del sobre) -->
        <div class="sobre-fig-nueva__back">
          <span>⚽</span>
        </div>
        <!-- Cara revelada -->
        <div class="sobre-fig-nueva__front" style="background: linear-gradient(145deg, #f5f0dc, #e8dfc0)">
          <div class="sfn__header" style="background: ${equipo.colorPrimario ?? "var(--verde-claro)"}">
            <span class="sfn__dorsal">#${jugador.dorsal}</span>
            <span class="sfn__pos">${jugador.pos} ${posEmoji}</span>
          </div>
          <div class="sfn__foto">${equipo.bandera ?? "🏳️"}</div>
          <div class="sfn__nombre">${jugador.nombre}</div>
          <div class="sfn__club">${jugador.club ?? ""}</div>
          <div class="sfn__equipo">${equipo.nombre ?? jugador.equipoId ?? ""}</div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Scroll suave al resultado
  setTimeout(() => {
    contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);

  // Botón ver álbum
  contenedor.querySelector("#btnVerAlbum")?.addEventListener("click", () => {
    document.getElementById("albumFiguritas")?.scrollIntoView({ behavior: "smooth" });
  });
}

// ─── EVENTOS ────────────────────────────────────────────

function _bindEventos() {
  // Delegación en la sección del álbum completa
  const albumSection = document.querySelector(".album-section");
  if (!albumSection) return;

  albumSection.addEventListener("click", (e) => {
    // Clic en sobre
    if (e.target.closest("#albumSobre")) {
      _abrirSobre();
      return;
    }

    // Clic en escudo (filtro)
    const escudoBtn = e.target.closest(".escudo-btn");
    if (escudoBtn) {
      const equipo = escudoBtn.dataset.equipo;
      _equipoActivo = equipo === "TODOS" ? null : equipo;
      _guardarEstado();
      _actualizarEscudosActivo(escudoBtn);
      _renderFiguritas();
      return;
    }
  });

  // Teclado en el sobre (accesibilidad)
  document.addEventListener("keydown", (e) => {
    const sobre = document.getElementById("albumSobre");
    if (e.key === "Enter" && document.activeElement === sobre) {
      _abrirSobre();
    }
  });
}

function _actualizarEscudosActivo(btnActivo) {
  document.querySelectorAll(".escudo-btn").forEach(btn => {
    btn.classList.toggle("active", btn === btnActivo);
  });
}

// ─── HELPERS ────────────────────────────────────────────

/** ID único de una figurita: equipoId + dorsal */
function _figId(jugador) {
  return `${jugador.equipoId ?? "XX"}_${jugador.dorsal}`;
}

/** Todos los jugadores enriquecidos con su equipoId */
function _getTodoElPlantel() {
  const todos = [];
  for (const [equipoId, plantel] of Object.entries(JUGADORES)) {
    plantel.forEach(j => todos.push({ ...j, equipoId }));
  }
  return todos;
}

/** Total de figuritas posibles */
function _contarTotalFiguritas() {
  return _getTodoElPlantel().length;
}

/** Selección aleatoria sin repetir */
function _pickAleatorio(arr, n) {
  const copia = [...arr];
  const result = [];
  for (let i = 0; i < n && copia.length; i++) {
    const idx = Math.floor(Math.random() * copia.length);
    result.push(copia.splice(idx, 1)[0]);
  }
  return result;
}

// ─── API PÚBLICA ─────────────────────────────────────────

/** Resetea el álbum completo (para testing) */
export function resetAlbum() {
  _figuritasConseguidas = new Set();
  _equipoActivo = null;
  localStorage.removeItem(LS_KEY_ALBUM);
  localStorage.removeItem(LS_KEY_DIARIO);
  initAlbum();
}

/** Agrega manualmente una figurita (para testing) */
export function agregarFigurita(equipoId, dorsal) {
  const plantel = getPlantelPorEquipo(equipoId);
  const jugador = plantel.find(j => j.dorsal === dorsal);
  if (!jugador) return;
  _figuritasConseguidas.add(_figId({ ...jugador, equipoId }));
  _guardarEstado();
  _renderFiguritas();
}

/** Estadísticas del álbum */
export function getEstadisticasAlbum() {
  const total = _contarTotalFiguritas();
  const conseguidas = _figuritasConseguidas.size;
  return {
    total,
    conseguidas,
    faltantes: total - conseguidas,
    porcentaje: total > 0 ? ((conseguidas / total) * 100).toFixed(1) : "0.0",
  };
}