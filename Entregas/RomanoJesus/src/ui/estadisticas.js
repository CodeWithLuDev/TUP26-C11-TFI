function renderizarEstadisticas(estadoTorneo) {
  const contenedor = document.getElementById("vista-estadisticas");

  const todosLosPartidos = obtenerTodosLosPartidosParaEstadisticas(estadoTorneo);
  const goleadores = calcularTopGoleadores(todosLosPartidos);
  const asistidores = calcularTopAsistidores(todosLosPartidos);

  contenedor.innerHTML = `
    <h2 class="titulo-seccion">Goleadores y asistidores</h2>
    <div class="grilla-rankings">
      <div class="panel-ranking">
        <div class="panel-ranking__titulo">⚽ Top goleadores</div>
        ${
          goleadores.length === 0
            ? `<div class="sin-datos">Todavía no hay goles registrados.<br>Cargá resultados desde la sección <strong>Fixture</strong>, o usá "Generar goles automáticos" en cada partido jugado.</div>`
            : goleadores.slice(0, 20).map((g, i) => renderizarFilaRanking(i, g.jugador, g.equipoId, g.goles)).join("")
        }
      </div>
      <div class="panel-ranking">
        <div class="panel-ranking__titulo">🅰️ Top asistidores</div>
        ${
          asistidores.length === 0
            ? `<div class="sin-datos">Todavía no hay asistencias registradas.<br>Cargalas desde la sección Fixture, en el detalle de cada partido.</div>`
            : asistidores.slice(0, 20).map((a, i) => renderizarFilaRanking(i, a.jugador, a.equipoId, a.asistencias)).join("")
        }
      </div>
    </div>
  `;
}

function renderizarFilaRanking(indice, jugador, equipoId, cantidad) {
  const equipo = equipoId ? obtenerEquipoPorId(equipoId) : null;
  const nombreJugador = jugador && jugador.trim() ? jugador : "(sin nombre)";
  return `
    <div class="fila-ranking">
      <span class="fila-ranking__puesto">${indice + 1}</span>
      <span class="fila-ranking__nombre">${nombreJugador}</span>
      <span class="fila-ranking__equipo">${equipo ? `${getFlagImg(equipo.codigoIso, equipo.nombre, "w24")} ${equipo.nombre}` : ""}</span>
      <span class="fila-ranking__cantidad">${cantidad}</span>
    </div>
  `;
}

function obtenerTodosLosPartidosParaEstadisticas(estadoTorneo) {
  let partidos = [...(estadoTorneo.partidos || [])];
  if (estadoTorneo.bracket) {
    const llavesBracket = [
      ...(estadoTorneo.bracket.octavos || []),
      ...(estadoTorneo.bracket.cuartos || []),
      ...(estadoTorneo.bracket.semis || []),
      ...(estadoTorneo.bracket.final || []),
      ...(estadoTorneo.bracket.tercerPuesto || []),
    ];
    partidos = partidos.concat(llavesBracket.filter((l) => l.jugado));
  }
  return partidos;
}
