function renderizarGrupos(estadoTorneo) {
  const contenedor = document.getElementById("vista-grupos");

  contenedor.innerHTML = `
    <h2 class="titulo-seccion">Fase de grupos</h2>
    <div class="grilla-grupos">
      ${GRUPOS.map((letraGrupo) => renderizarPanelDeGrupo(letraGrupo, estadoTorneo)).join("")}
    </div>
  `;
}

function renderizarPanelDeGrupo(letraGrupo, estadoTorneo) {
  const equiposDelGrupo = obtenerEquiposPorGrupo(letraGrupo);
  const partidosDelGrupo = estadoTorneo.partidos.filter((partido) => partido.grupo === letraGrupo);
  const tabla = calcularTablaDeGrupo(equiposDelGrupo, partidosDelGrupo);

  return `
    <div class="panel-grupo">
      <div class="panel-grupo__titulo">Grupo <span>${letraGrupo}</span></div>
      <table class="tabla-posiciones">
        <thead>
          <tr>
            <th>#</th>
            <th style="text-align:left">Equipo</th>
            <th>PJ</th><th>PG</th><th>PE</th><th>PP</th>
            <th>GF</th><th>GC</th><th>DG</th><th>PTS</th>
          </tr>
        </thead>
        <tbody>
          ${tabla.map((fila, indice) => {
            const eq = obtenerEquipoPorId(fila.equipoId);
            return `
            <tr class="${indice < 2 ? "fila-clasificado" : ""}">
              <td>${indice + 1}</td>
              <td>${eq ? getFlagImg(eq.codigoIso, eq.nombre, "w24") : ""} ${fila.nombre}</td>
              <td>${fila.pj}</td>
              <td>${fila.pg}</td>
              <td>${fila.pe}</td>
              <td>${fila.pp}</td>
              <td>${fila.gf}</td>
              <td>${fila.gc}</td>
              <td>${fila.dg > 0 ? "+" + fila.dg : fila.dg}</td>
              <td class="celda-puntos">${fila.pts}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    </div>
  `;
}
