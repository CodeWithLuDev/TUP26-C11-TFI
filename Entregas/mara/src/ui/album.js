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

  _renderSelector(validos);
  _renderPlantilla();
  _bindEventos();
}

function _renderSelector(validos) {
  const cont = document.getElementById("albumEscudos");
  if (!cont) return;

  const lbl = document.querySelector(".album-filtro__label");
  if (lbl) lbl.setAttribute("for", "albumEquipoSelect");

  const sel = document.createElement("select");
  sel.id = "albumEquipoSelect";
  sel.className = "album-desplegable-equipos";

  validos.forEach(eq => {
    const opt = document.createElement("option");
    opt.value = eq.id;
    if (_equipoActivo === eq.id) opt.selected = true;
    opt.textContent = `${eq.bandera} ${eq.nombre}`;
    sel.appendChild(opt);
  });

  cont.innerHTML = "";
  cont.appendChild(sel);
}

function _renderPlantilla() {
  const c = document.getElementById("albumFiguritas");
  if (!c) return;

  const plantel = getPlantelPorEquipo(_equipoActivo);
  const equipo = getEquipoPorId(_equipoActivo);

  if (!plantel?.length) {
    c.innerHTML = `<div class="album-empty"><p>Sin jugadores cargados</p></div>`;
    return;
  }

  const fotoUrl = equipo?.fotoEquipo;

  c.innerHTML = `
    <div class="album-plantilla">
      <div class="album-plantilla__foto">
        ${fotoUrl
          ? `<img src="${fotoUrl}" alt="${equipo.nombre}" class="album-equipo-img" />`
          : `<div class="album-equipo-placeholder">
              <span class="album-equipo-placeholder__bandera">${equipo.bandera}</span>
              <span class="album-equipo-placeholder__nombre">${equipo.nombre}</span>
            </div>`
        }
      </div>
      <div class="album-plantilla__lista">
        <input type="text" id="albumBuscar" class="album-buscar" placeholder="Buscar jugador por nombre..." />
        <div id="albumBloques">
          ${_renderBloque("GK", "Arqueros", plantel)}
          ${_renderBloque("DEF", "Defensores", plantel)}
          ${_renderBloque("MID", "Volantes", plantel)}
          ${_renderBloque("FWD", "Delanteros", plantel)}
        </div>
      </div>
    </div>
  `;

  document.getElementById("albumBuscar")?.addEventListener("input", e => {
    _filtrarJugadores(e.target.value);
  });
}

function _renderBloque(pos, label, plantel) {
  const jugadores = plantel
    .filter(j => j.pos === pos)
    .sort((a, b) => a.dorsal - b.dorsal);

  if (!jugadores.length) return "";

  return `
    <div class="album-bloque" data-pos="${pos}">
      <h3 class="album-bloque__titulo">${label}</h3>
      <div class="album-bloque__grid">
        ${jugadores.map(j => `
          <div class="album-jugador" data-nombre="${j.nombre.toLowerCase()}">
            <span class="album-jugador__dorsal">${j.dorsal}</span>
            <span class="album-jugador__nombre">${j.nombre}</span>
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
  document.getElementById("albumEquipoSelect")
    ?.addEventListener("change", e => {
      _equipoActivo = e.target.value;
      try { localStorage.setItem(LS_KEY, JSON.stringify({ equipoActivo: _equipoActivo })); } catch {}
      _renderPlantilla();
    });
}

export function resetAlbum() {
  try { localStorage.removeItem(LS_KEY); } catch {}
  initAlbum();
}
