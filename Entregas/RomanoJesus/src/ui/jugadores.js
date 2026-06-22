const AVATAR_BASE = "https://ui-avatars.com/api/?background=random&color=fff&name=";

function getAvatarImg(nombre) {
  const encoded = encodeURIComponent(nombre);
  return `<img src="${AVATAR_BASE}${encoded}&size=64" alt="${nombre}" class="jugador-avatar" loading="lazy">`;
}

const PLANTILLAS_CACHE = {};

const APELLIDOS_POOL = ["García","Martínez","López","González","Rodríguez","Fernández","Pérez","Silva","Torres","Romero","Cruz","Ortiz","Díaz","Moreno","Álvarez","Muñoz","Ruiz","Medina","Castillo","Ramos","Castro","Vargas","Herrera","Mendoza","Morales","Ortega","Navarro","Delgado","Paredes","Guzmán","Peña","Flores","Cabrera","Campos","Rivas","Soto","Acosta","Molina","Aguilar","Jiménez","Reyes","Gutiérrez","Núñez","Vega","Carrillo","Domínguez","Márquez","Vázquez","Sánchez","Ramírez"];

const NOMBRES_POOL = ["Juan","Carlos","Luis","Andrés","Diego","Pablo","Sergio","Jorge","Miguel","Alejandro","Fernando","Javier","Manuel","Ricardo","Eduardo","David","Daniel","Francisco","Héctor","Raúl","Iván","Marco","Víctor","Óscar","Hugo","Gabriel","Adrián","Rafael","Enrique","Alberto","Ángel","Pedro","Antonio","José","Roberto","Julián","Martín","Emilio","Nicolás","Felipe"];

const POSICIONES_CICLO = ["Portero","Defensa","Defensa","Defensa","Defensa","Centrocampista","Centrocampista","Centrocampista","Delantero","Delantero","Delantero"];

const ES_REAL = {};
JUGADORES_DESTACADOS.forEach(j => { ES_REAL[j.nombre] = true; });

function obtenerPlantillaCompleta(equipoId) {
  if (PLANTILLAS_CACHE[equipoId]) return PLANTILLAS_CACHE[equipoId];

  const reales = JUGADORES_DESTACADOS.filter(j => j.equipoId === equipoId);
  const seed = equipoId.charCodeAt(0) + (equipoId.charCodeAt(1) || 0);
  const total = 23;

  const result = [...reales];
  for (let i = result.length; i < total; i++) {
    const idxNom = (seed + i * 7) % NOMBRES_POOL.length;
    const idxApe = (seed + i * 13) % APELLIDOS_POOL.length;
    const idxPos = (seed + i) % POSICIONES_CICLO.length;
    result.push({
      nombre: `${NOMBRES_POOL[idxNom]} ${APELLIDOS_POOL[idxApe]}`,
      edad: 21 + ((seed + i * 3) % 15),
      equipoId,
      club: "",
      liga: "",
      posicion: POSICIONES_CICLO[idxPos],
      golesTrayectoria: (seed + i * 5) % 70,
    });
  }

  PLANTILLAS_CACHE[equipoId] = result;
  return result;
}

function renderizarJugadores() {
  const contenedor = document.getElementById("vista-jugadores");

  const equiposConPlantilla = EQUIPOS.map(eq => ({
    equipo: eq,
    jugadores: obtenerPlantillaCompleta(eq.id),
  }));

  const tarjetaJugador = (j) => {
    const eq = obtenerEquipoPorId(j.equipoId);
    const tieneClub = j.club && j.club !== "";
    const imgId = `jug-img-${j.nombre.replace(/\s/g, "-")}-${j.equipoId}`;
    return `
      <div class="tarjeta-jugador" data-jugador="${j.nombre}" data-es-real="${ES_REAL[j.nombre] ? "1" : "0"}">
        <div class="tarjeta-jugador__avatar" id="${imgId}">
          ${getAvatarImg(j.nombre)}
        </div>
        <div class="tarjeta-jugador__cabecera">
          ${eq ? getFlagImg(eq.codigoIso, eq.nombre, "w32") : ""}
          <span class="tarjeta-jugador__posicion">${j.posicion}</span>
        </div>
        <div class="tarjeta-jugador__nombre">${j.nombre}</div>
        <div class="tarjeta-jugador__edad">${j.edad} años · ${eq ? getFlagImg(eq.codigoIso, eq.nombre, "w24") + " " + eq.nombre : j.equipoId}</div>
        ${tieneClub ? `
        <div class="tarjeta-jugador__club">
          <span class="tarjeta-jugador__club-nombre">${j.club}</span>
          <span class="tarjeta-jugador__liga">${j.liga}</span>
        </div>` : '<div class="tarjeta-jugador__club" style="font-size:11px;color:var(--texto-secundario)">Sin datos de club</div>'}
        <div class="tarjeta-jugador__goles">⚽ ${j.golesTrayectoria}+ goles</div>
      </div>
    `;
  };

  const panelEquipo = (eq, jugadores, idx) => {
    const panelId = `panel-${eq.id}`;
    const contentId = `pcontent-${eq.id}`;
    return `
      <div class="panel-grupo" id="${panelId}">
        <div class="panel-grupo__titulo panel-equipo-titulo" data-target="${contentId}" style="cursor:pointer;display:flex;align-items:center;gap:8px">
          <span class="panel-toggle">▶</span>
          ${getFlagImg(eq.codigoIso, eq.nombre, "w32")} ${eq.nombre}
          <span style="color:var(--texto-secundario);font-size:11px;margin-left:auto">${jugadores.length} jugadores</span>
        </div>
        <div id="${contentId}" class="panel-equipo-contenido" style="display:none">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;padding:12px">
            ${jugadores.map(tarjetaJugador).join("")}
          </div>
        </div>
      </div>
    `;
  };

  contenedor.innerHTML = `
    <h2 class="titulo-seccion">Jugadores de todas las selecciones</h2>
    <p style="font-size:12px;color:var(--texto-secundario);margin-bottom:18px">
      🇺🇳 Plantel completo de cada selección participante. Hacé clic en cada selección para ver sus jugadores.
    </p>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${equiposConPlantilla.map(({ equipo, jugadores }, i) => panelEquipo(equipo, jugadores, i)).join("")}
    </div>
  `;

  contenedor.querySelectorAll(".panel-equipo-titulo").forEach(titulo => {
    titulo.addEventListener("click", () => {
      const content = document.getElementById(titulo.dataset.target);
      const toggle = titulo.querySelector(".panel-toggle");
      if (!content) return;
      const isOpen = content.style.display !== "none";
      content.style.display = isOpen ? "none" : "block";
      toggle.textContent = isOpen ? "▶" : "▼";
    });
  });

}

function renderizarDestacados() {
  const contenedor = document.getElementById("vista-destacados");

  const porPosicion = {};
  JUGADORES_DESTACADOS.forEach((j) => {
    if (!porPosicion[j.posicion]) porPosicion[j.posicion] = [];
    porPosicion[j.posicion].push(j);
  });

  const porEquipo = {};
  JUGADORES_DESTACADOS.forEach((j) => {
    if (j.equipoId === "ITA" || j.equipoId === "POL" || j.equipoId === "NGA" || j.equipoId === "GEO") return;
    if (!porEquipo[j.equipoId]) porEquipo[j.equipoId] = [];
    porEquipo[j.equipoId].push(j);
  });

  const tarjetaDestacado = (j) => {
    const eq = obtenerEquipoPorId(j.equipoId);
    const imgId = `dest-img-${j.nombre.replace(/\s/g, "-")}`;
    return `
      <div class="tarjeta-jugador" data-destacado="${j.nombre}">
        <div class="tarjeta-jugador__avatar" id="${imgId}">
          ${getAvatarImg(j.nombre)}
        </div>
        <div class="tarjeta-jugador__cabecera">
          ${eq ? getFlagImg(eq.codigoIso, eq.nombre, "w32") : ""}
          <span class="tarjeta-jugador__posicion">${j.posicion}</span>
        </div>
        <div class="tarjeta-jugador__nombre">${j.nombre}</div>
        <div class="tarjeta-jugador__edad">${j.edad} años · ${eq ? eq.nombre : j.equipoId}</div>
        <div class="tarjeta-jugador__club">
          <span class="tarjeta-jugador__club-nombre">${j.club}</span>
          <span class="tarjeta-jugador__liga">${j.liga}</span>
        </div>
        <div class="tarjeta-jugador__goles">⚽ ${j.golesTrayectoria}+ goles en carrera</div>
      </div>
    `;
  };

  contenedor.innerHTML = `
    <h2 class="titulo-seccion">Jugadores destacados del Mundial 2026</h2>
    <p style="font-size:12px;color:var(--texto-secundario);margin-bottom:18px;padding:12px 16px;background:var(--panel);border:1px solid var(--borde);border-radius:var(--radio)">
      🌍 Datos de los principales jugadores participantes. Los clubes y ligas corresponden a la temporada 2025/26.
    </p>

    <div class="jugadores-filtros">
      <button class="filtro-chip activo" data-ver="grid">Grilla</button>
      <button class="filtro-chip" data-ver="posicion">Por posición</button>
      <button class="filtro-chip" data-ver="equipo">Por selección</button>
    </div>

    <div id="jugadores-contenido" class="grilla-equipos" style="grid-template-columns:repeat(auto-fill, minmax(280px, 1fr))">
      ${JUGADORES_DESTACADOS.map(tarjetaDestacado).join("")}
    </div>
  `;

  contenedor.querySelectorAll(".jugadores-filtros .filtro-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      contenedor.querySelectorAll(".jugadores-filtros .filtro-chip").forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      const modo = btn.dataset.ver;
      const contenido = document.getElementById("jugadores-contenido");
      if (modo === "grid") {
        contenido.className = "grilla-equipos";
        contenido.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))";
        contenido.innerHTML = JUGADORES_DESTACADOS.map(tarjetaDestacado).join("");
      } else if (modo === "posicion") {
        contenido.className = "jugadores-por-categoria";
        contenido.style.gridTemplateColumns = "";
        contenido.innerHTML = Object.entries(porPosicion).map(([pos, jugadores]) => `
          <div class="panel-ranking">
            <div class="panel-ranking__titulo">${pos}</div>
            ${jugadores.map(j => {
              const eq = obtenerEquipoPorId(j.equipoId);
              return `
                <div class="fila-ranking">
                  <span class="fila-ranking__nombre">${j.nombre}</span>
                  <span class="fila-ranking__equipo">${eq ? getFlagImg(eq.codigoIso, eq.nombre, "w24") + " " + eq.nombre : ""}</span>
                  <span style="color:var(--texto-secundario);font-size:12px">${j.club}</span>
                </div>
              `;
            }).join("")}
          </div>
        `).join("");
      } else {
        contenido.className = "jugadores-por-categoria";
        contenido.style.gridTemplateColumns = "";
        contenido.innerHTML = Object.entries(porEquipo).map(([eqId, jugadores]) => {
          const eq = obtenerEquipoPorId(eqId);
          return `
            <div class="panel-ranking">
              <div class="panel-ranking__titulo">${eq ? getFlagImg(eq.codigoIso, eq.nombre, "w32") + " " + eq.nombre : eqId}</div>
              ${jugadores.map(j => `
                <div class="fila-ranking">
                  <span class="fila-ranking__nombre">${j.nombre}</span>
                  <span style="color:var(--texto-secundario);font-size:12px">${j.posicion}</span>
                  <span style="color:var(--azul-usa-claro);font-size:12px">${j.club}</span>
                </div>
              `).join("")}
            </div>
          `;
        }).join("");
      }
    });
  });
}