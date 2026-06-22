function renderizarEquipos() {
  const contenedor = document.getElementById("vista-equipos");
  const equiposOrdenados = [...EQUIPOS].sort((a, b) => a.grupo.localeCompare(b.grupo) || a.nombre.localeCompare(b.nombre));

  contenedor.innerHTML = `
    <h2 class="titulo-seccion">Selecciones participantes (48)</h2>
    <div class="grilla-equipos">
      ${equiposOrdenados.map((equipo) => `
        <div class="tarjeta-equipo">
          <div class="tarjeta-equipo__bandera">${getFlagImg(equipo.codigoIso, equipo.nombre)}</div>
          <div class="tarjeta-equipo__info">
            <h3>${equipo.nombre}</h3>
            <span class="tarjeta-equipo__grupo">GRUPO ${equipo.grupo}</span>
            <span class="tarjeta-equipo__confed">${equipo.confederacion}</span>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}
