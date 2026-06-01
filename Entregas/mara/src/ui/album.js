// ═══════════════════════════════════════════════════════════
// src/ui/album.js — Álbum Panini Potrero '26
// Estilo figurita Panini oficial con foto real
// ═══════════════════════════════════════════════════════════

import { getPlantelPorEquipo } from "../data/jugadores.js";
import { EQUIPOS, getEquipoPorId } from "../data/equipos.js";

const LS_KEY = "copa_potrero_album_v1";

const POS_COLOR = {
  GK:  "#e67e22",
  DEF: "#2980b9",
  MID: "#27ae60",
  FWD: "#c0392b",
};
const POS_LABEL = { GK: "POR", DEF: "DEF", MID: "MED", FWD: "DEL" };

// ─── IDs FotMob ───────────────────────────────────────────
const FOTO_IDS = {
  "ARG_1":"645885","ARG_10":"30981","ARG_9":"222702","ARG_25":"929766",
  "ARG_7":"561772","ARG_8":"910366","ARG_17":"934716","ARG_13":"726883",
  "ARG_6":"874939","ARG_2":"748820","ARG_14":"39580","ARG_5":"68548",
  "ARG_18":"908265","ARG_19":"1028988","ARG_11":"861588","ARG_12":"100899",
  "ARG_15":"68422","ARG_16":"597946","ARG_22":"652278","ARG_23":"73719",
  "BRA_10":"478045","BRA_11":"852007","BRA_9":"461607","BRA_1":"189332",
  "BRA_4":"564992","BRA_7":"700041","BRA_20":"1104337","BRA_17":"793899",
  "BRA_15":"780705","BRA_5":"580298",
  "FRA_10":"839087","FRA_7":"170702","FRA_1":"740935","FRA_8":"882288",
  "FRA_15":"880987","FRA_11":"542401","FRA_19":"924217","FRA_22":"906711",
  "FRA_14":"780685","FRA_6":"659238",
  "ESP_21":"1117492","ESP_10":"965129","ESP_19":"961995","ESP_18":"937762",
  "ESP_1":"785468","ESP_7":"222591","ESP_16":"798148","ESP_8":"817054",
  "ESP_15":"868759","ESP_17":"926771",
  "GER_10":"1017795","GER_20":"839476","GER_1":"3469","GER_7":"700471",
  "GER_16":"4965","GER_17":"648516","GER_21":"877397","GER_8":"457655",
  "POR_7":"13322","POR_11":"875791","POR_10":"511519","POR_9":"942496",
  "POR_1":"801590","POR_8":"1019009","POR_2":"771704","POR_16":"868726",
  "ENG_10":"1019079","ENG_9":"55763","ENG_7":"961169","ENG_8":"876713",
  "ENG_1":"225321","ENG_11":"697145","ENG_17":"976592",
  "NED_4":"99655","NED_11":"895549","NED_10":"197356","NED_20":"880987",
  "NED_17":"829990","NED_18":"949024",
  "COL_7":"881082","COL_10":"173982","COL_18":"928135",
  "URU_11":"902398","URU_18":"765568","URU_9":"42296",
  "NOR_9":"773997","NOR_10":"851507",
  "SEN_10":"200539","SEN_7":"663660",
  "MAR_2":"668976","MAR_10":"225014","MAR_7":"561380",
  "EGY_10":"293223","EGY_20":"995003",
  "BEL_15":"3619","BEL_9":"33015","BEL_21":"943027",
  "JAP_7":"876373","JAP_9":"888002",
  "CRO_10":"200029","CRO_8":"252059",
  "TUR_10":"771993","TUR_17":"1036232",
  "KOR_7":"45654","KOR_10":"721515",
  "MEX_19":"985083","MEX_10":"188148",
  "AUT_7":"614622","AUT_8":"775478","AUT_10":"879483","AUT_9":"41236",
  "ALG_10":"198066",
};

let _equipoActivo = null;

export function initAlbum() {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    _equipoActivo = d.equipoActivo ?? null;
  } catch { _equipoActivo = null; }

  const validos = EQUIPOS.filter(eq => getPlantelPorEquipo(eq.id)?.length > 0);
  if (!_equipoActivo && validos.length) _equipoActivo = validos[0].id;

  _renderEstructura(validos);
  _renderFiguritas();
  _bindEventos();
}

function _renderEstructura(validos) {
  const s = document.querySelector(".album-section");
  if (!s) return;
  s.innerHTML = `
    <div class="album-section__header">
      <h2 class="album-section__titulo">
        <span class="album-badge">PANINI</span> ÁLBUM POTRERO '26
      </h2>
      <div class="album-filtro">
        <label for="albumEquipoSelect" class="album-filtro__label">Ver plantel de:</label>
        <select id="albumEquipoSelect" class="album-desplegable-equipos">
          ${validos.map(eq=>`
            <option value="${eq.id}" ${_equipoActivo===eq.id?"selected":""}>
              ${eq.bandera} ${eq.nombre}
            </option>`).join("")}
        </select>
      </div>
    </div>
    <div id="albumFiguritas" class="album-figuritas"></div>
  `;
}

function _renderFiguritas() {
  const c = document.getElementById("albumFiguritas");
  if (!c) return;
  const plantel = getPlantelPorEquipo(_equipoActivo);
  const equipo  = getEquipoPorId(_equipoActivo);
  if (!plantel?.length) {
    c.innerHTML = `<div class="album-empty"><p>📭 Sin jugadores cargados</p></div>`;
    return;
  }
  c.innerHTML = "";
  [...plantel].sort((a,b)=>a.dorsal-b.dorsal)
    .forEach((j,i) => c.appendChild(_crearFigurita(j, equipo, i)));
}

function _crearFigurita(j, eq, idx) {
  const posCol  = POS_COLOR[j.pos] ?? "#555";
  const posLbl  = POS_LABEL[j.pos] ?? j.pos;
  const key     = `${_equipoActivo}_${j.dorsal}`;
  const fotoId  = FOTO_IDS[key];
  const fotoUrl = fotoId
    ? `https://images.fotmob.com/image_resources/playerimages/${fotoId}.png`
    : null;
  const iniciales = j.nombre.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();
  const apellido  = j.nombre.split(" ").pop().toUpperCase();
  const nombre    = j.nombre.split(" ").slice(0,-1).join(" ");

  const w = document.createElement("div");
  w.className = "fig-wrapper";
  w.style.animationDelay = `${Math.min(idx*0.02,0.4)}s`;

  w.innerHTML = `
    <div class="fig-card">

      <!-- NÚMERO FLOTANTE -->
      <div class="fig-num" style="background:${posCol}">${j.dorsal}</div>

      <!-- ZONA FOTO -->
      <div class="fig-foto-zona" style="background:linear-gradient(160deg,${posCol}cc,${posCol}55)">
        ${fotoUrl
          ? `<img src="${fotoUrl}" alt="${j.nombre}" class="fig-img"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
             /><div class="fig-iniciales" style="display:none">${iniciales}</div>`
          : `<div class="fig-iniciales">${iniciales}</div>`
        }
        <!-- Degradado inferior -->
        <div class="fig-foto-fade" style="--col:${posCol}"></div>
      </div>

      <!-- BADGE POSICIÓN -->
      <div class="fig-pos-badge" style="background:${posCol}">${posLbl}</div>

      <!-- NOMBRE -->
      <div class="fig-data">
        <div class="fig-nombre-small">${nombre}</div>
        <div class="fig-apellido">${apellido}</div>
        <div class="fig-club-line">${j.club ?? ""}</div>
      </div>

      <!-- PIE -->
      <div class="fig-footer">
        <span class="fig-flag">${eq?.bandera ?? ""}</span>
        <span class="fig-codigo">${eq?.id ?? ""}</span>
        <span class="fig-logo-panini">PANINI</span>
      </div>

      <!-- BRILLO holográfico -->
      <div class="fig-holo"></div>
    </div>
  `;
  return w;
}

function _bindEventos() {
  document.getElementById("albumEquipoSelect")
    ?.addEventListener("change", e => {
      _equipoActivo = e.target.value;
      localStorage.setItem(LS_KEY, JSON.stringify({equipoActivo:_equipoActivo}));
      _renderFiguritas();
    });
}

export function resetAlbum() {
  localStorage.removeItem(LS_KEY);
  initAlbum();
}