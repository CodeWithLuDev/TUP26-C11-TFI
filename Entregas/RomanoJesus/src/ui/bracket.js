function renderizarPlayoffs(estadoTorneo) {
  const contenedor = document.getElementById("vista-playoffs");

  const tablasPorGrupo = {};
  GRUPOS.forEach((letraGrupo) => {
    const equiposDelGrupo = obtenerEquiposPorGrupo(letraGrupo);
    const partidosDelGrupo = estadoTorneo.partidos.filter((p) => p.grupo === letraGrupo);
    tablasPorGrupo[letraGrupo] = calcularTablaDeGrupo(equiposDelGrupo, partidosDelGrupo);
  });

  const clasificacion = calcularClasificacionAOctavos(null, tablasPorGrupo);

  if (!clasificacion.fasesGruposCompleta) {
    contenedor.innerHTML = `
      <h2 class="titulo-seccion">Playoffs</h2>
      <div class="aviso-bracket">
        Todavía no se completó la fase de grupos.<br>
        El bracket se arma automáticamente con los <strong>2 primeros de cada grupo</strong>
        y los <strong>8 mejores terceros</strong> en cuanto se jueguen los 72 partidos.
      </div>
    `;
    return;
  }

  if (!estadoTorneo.bracket) {
    const clasificados16 = armarListaDe16(clasificacion);
    estadoTorneo.bracket = crearBracketInicial(clasificados16);
    guardarYPersistir(estadoTorneo);
  }

  const finalJugada = estadoTorneo.bracket.final[0] && estadoTorneo.bracket.final[0].jugado;
  const ganadorFinal = finalJugada ? obtenerGanadorPartido(estadoTorneo.bracket.final[0]) : null;
  const equipoCampeon = ganadorFinal ? obtenerEquipoPorId(ganadorFinal) : null;

  contenedor.innerHTML = `
    <h2 class="titulo-seccion">Playoffs — Eliminación directa</h2>
    ${equipoCampeon ? `
      <div class="campeon-banner anim-celebracion">
        <span class="campeon-banner__trofeo">🏆</span>
        <span class="campeon-banner__texto">¡${equipoCampeon.nombre} es el campeón del Mundial 2026!</span>
        ${getFlagImg(equipoCampeon.codigoIso, equipoCampeon.nombre, "w48")}
      </div>
    ` : ""}
    <div class="bracket-cancha">
      <div class="bracket">
        <div class="bracket__rondas">
          ${renderizarRonda("Octavos de Final", estadoTorneo.bracket.octavos)}
          ${renderizarRonda("Cuartos de Final", estadoTorneo.bracket.cuartos)}
          ${renderizarRonda("Semifinales", estadoTorneo.bracket.semis)}
          ${renderizarRonda("Final", estadoTorneo.bracket.final)}
          ${renderizarRonda("Tercer Puesto", estadoTorneo.bracket.tercerPuesto)}
        </div>
      </div>
    </div>
  `;

  contenedor.querySelectorAll("[data-accion='confirmar-llave']").forEach((boton) => {
    boton.addEventListener("click", () => confirmarLlave(boton.dataset.idLlave));
  });
}

function renderizarRonda(titulo, llaves) {
  return `
    <div class="bracket__ronda">
      <div class="bracket__ronda-titulo">${titulo}</div>
      ${llaves.map((llave) => renderizarLlave(llave)).join("")}
    </div>
  `;
}

function renderizarLlave(llave) {
  const sinEquipos = !llave || !llave.equipoLocal || !llave.equipoVisitante;
  const ganadorId = llave ? obtenerGanadorPartido(llave) : null;
  return `
    <div class="llave ${sinEquipos ? "llave--vacia" : ""}">
      ${renderizarFilaLlave(llave, "local", ganadorId)}
      ${renderizarFilaLlave(llave, "visitante", ganadorId)}
      ${(!sinEquipos && llave && !llave.jugado)
        ? `<button class="llave__confirmar" data-accion="confirmar-llave" data-id-llave="${llave.id}">Confirmar resultado</button>`
        : ""}
    </div>
  `;
}

function renderizarFilaLlave(llave, rol, ganadorId) {
  if (!llave) return `<div class="llave__fila"><span class="llave__equipo">—</span></div>`;
  const equipo = rol === "local" ? llave.equipoLocal : llave.equipoVisitante;
  const goles = rol === "local" ? llave.golesLocal : llave.golesVisitante;
  const esGanador = equipo && equipo.equipoId && ganadorId === equipo.equipoId;

  if (!equipo || !equipo.nombre) {
    return `<div class="llave__fila"><span class="llave__equipo">A definir</span></div>`;
  }

  if (llave.jugado) {
    return `
      <div class="llave__fila ${esGanador ? "ganador" : ""}">
        <span class="llave__equipo">${getFlagImg(equipo.codigoIso, equipo.nombre, "w24")} ${equipo.nombre}</span>
        <span>${goles ?? ""}</span>
      </div>
    `;
  }

  return `
    <div class="llave__fila">
      <span class="llave__equipo">${getFlagImg(equipo.codigoIso, equipo.nombre, "w24")} ${equipo.nombre}</span>
      <input type="number" min="0" class="llave__gol-input" data-id-llave="${llave.id}" data-rol="${rol}">
    </div>
  `;
}

function confirmarLlave(idLlave) {
  const estadoTorneo = obtenerEstadoTorneo();
  if (!estadoTorneo || !estadoTorneo.bracket) return;
  const llave = buscarLlaveEnBracket(estadoTorneo.bracket, idLlave);
  if (!llave) return;

  const inputLocal = document.querySelector(`.llave__gol-input[data-rol='local'][data-id-llave='${idLlave}']`);
  const inputVisitante = document.querySelector(`.llave__gol-input[data-rol='visitante'][data-id-llave='${idLlave}']`);

  const golesLocal = parseInt(inputLocal ? inputLocal.value : "", 10);
  const golesVisitante = parseInt(inputVisitante ? inputVisitante.value : "", 10);

  if (Number.isNaN(golesLocal) || Number.isNaN(golesVisitante)) {
    alert("Ingresá el resultado de ambos equipos.");
    return;
  }

  llave.golesLocal = golesLocal;
  llave.golesVisitante = golesVisitante;

  if (golesLocal === golesVisitante) {
    const penalesLocal = parseInt(prompt(`Empate. Penales — ${(llave.equipoLocal || {}).nombre || "?"}:`, "0"), 10);
    const penalesVisitante = parseInt(prompt(`Penales — ${(llave.equipoVisitante || {}).nombre || "?"}:`, "0"), 10);
    llave.penalesLocal = Number.isNaN(penalesLocal) ? 0 : penalesLocal;
    llave.penalesVisitante = Number.isNaN(penalesVisitante) ? 0 : penalesVisitante;
  }

  llave.jugado = true;
  propagarGanadores(estadoTorneo.bracket);
  guardarYPersistir(estadoTorneo);
  renderizarPlayoffs(estadoTorneo);
}

function buscarLlaveEnBracket(bracket, idLlave) {
  const todasLasLlaves = [
    ...(bracket.octavos || []),
    ...(bracket.cuartos || []),
    ...(bracket.semis || []),
    ...(bracket.final || []),
    ...(bracket.tercerPuesto || []),
  ];
  return todasLasLlaves.find((llave) => llave.id === idLlave) || null;
}
