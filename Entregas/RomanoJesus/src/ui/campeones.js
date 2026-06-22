const HISTORIAL_FALLBACK = {
  "Italia": { codigoIso: "it", nombre: "Italia" },
  "Checoslovaquia": { codigoIso: "cz", nombre: "Checoslovaquia" },
  "Hungría": { codigoIso: "hu", nombre: "Hungría" },
  "Países Bajos": { codigoIso: "nl", nombre: "Países Bajos" },
  "Unión Soviética": { codigoIso: "ru", nombre: "Unión Soviética" },
  "Yugoslavia": { codigoIso: "rs", nombre: "Yugoslavia" },
};

function buscarPaisHistorial(nombrePais) {
  const eq = EQUIPOS.find(e => e.nombre === nombrePais || nombrePais.startsWith(e.nombre) || e.nombre.startsWith(nombrePais));
  if (eq) return eq;
  return HISTORIAL_FALLBACK[nombrePais] || null;
}

function renderizarCampeones() {
  const contenedor = document.getElementById("vista-campeones");
  const tablaCampeones = {};
  const golesPorPais = {};
  const finalesPorPais = {};

  HISTORIAL_MUNDIALES.forEach((m) => {
    tablaCampeones[m.campeon] = (tablaCampeones[m.campeon] || 0) + 1;
    finalesPorPais[m.campeon] = (finalesPorPais[m.campeon] || 0) + 1;
    finalesPorPais[m.subcampeon] = (finalesPorPais[m.subcampeon] || 0) + 1;
  });

  const maxTitulos = Math.max(...Object.values(tablaCampeones));
  const ranking = Object.entries(tablaCampeones).sort((a, b) => b[1] - a[1]);

  contenedor.innerHTML = `
    <h2 class="titulo-seccion">Historial completo de la Copa del Mundo</h2>

    <div class="historial-stats">
      <div class="historial-stat">
        <span class="historial-stat__num">${HISTORIAL_MUNDIALES.length}</span>
        <span class="historial-stat__label">Ediciones</span>
      </div>
      <div class="historial-stat">
        <span class="historial-stat__num">${ranking.length}</span>
        <span class="historial-stat__label">Campeones distintos</span>
      </div>
      <div class="historial-stat">
        <span class="historial-stat__num">${ranking[0]?.[1] || 0}</span>
        <span class="historial-stat__label">Máx. títulos</span>
        <span class="historial-stat__pais">${ranking[0]?.[0] || "—"}</span>
      </div>
      <div class="historial-stat">
        <span class="historial-stat__num">${Object.keys(finalesPorPais).length}</span>
        <span class="historial-stat__label">Países en finales</span>
      </div>
    </div>

    <h3 class="titulo-seccion" style="margin-top:24px;font-size:13px">Campeones por país</h3>
    <div class="ranking-titulos">
      ${ranking.map(([pais, titulos], i) => {
        const eq = buscarPaisHistorial(pais);
        const ancho = Math.round((titulos / maxTitulos) * 100);
        return `
          <div class="ranking-titulos__fila">
            <span class="ranking-titulos__pos">${i + 1}</span>
            <span class="ranking-titulos__pais">${eq ? getFlagImg(eq.codigoIso, eq.nombre, "w32") : "🏆"} ${pais}</span>
            <div class="ranking-titulos__barra-cont">
              <div class="ranking-titulos__barra" style="width:${ancho}%"></div>
            </div>
            <span class="ranking-titulos__num">${titulos} ${titulos === 1 ? "título" : "títulos"}</span>
          </div>
        `;
      }).join("")}
    </div>

    <h3 class="titulo-seccion" style="margin-top:24px;font-size:13px">Todas las finales</h3>
    <div class="linea-tiempo-campeones">
      ${[...HISTORIAL_MUNDIALES].reverse().map((m) => {
        const campeon = buscarPaisHistorial(m.campeon);
        const subcampeon = buscarPaisHistorial(m.subcampeon);
        return `
          <div class="tarjeta-campeon">
            <div class="tarjeta-campeon__anio">${m.anio}</div>
            <div class="tarjeta-campeon__enfrentamiento">
              <span class="tarjeta-campeon__pais campeon">
                <span class="trofeo">🏆</span>
                ${campeon ? getFlagImg(campeon.codigoIso, campeon.nombre, "w40") : "🌍"}
                ${m.campeon}
              </span>
              <span class="tarjeta-campeon__vs">vs</span>
              <span class="tarjeta-campeon__pais">
                ${subcampeon ? getFlagImg(subcampeon.codigoIso, subcampeon.nombre, "w40") : "🌍"}
                ${m.subcampeon}
              </span>
            </div>
            <div class="tarjeta-campeon__detalle">
              <div class="tarjeta-campeon__resultado">${m.resultado}</div>
              <div>${m.sede} · ${m.equipos} equipos ${m.nota ? `· ${m.nota}` : ""}</div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}
