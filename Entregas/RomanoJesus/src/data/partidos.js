const OFFSET_UTC_POR_SEDE = {
  "Estadio Azteca, CDMX": -6,
  "Estadio BBVA, Monterrey": -6,
  "Estadio Akron, Guadalajara": -6,
  "Estadio Guadalajara": -6,
  "BC Place, Vancouver": -7,
  "Estadio Seattle": -7,
  "Estadio Los Ángeles": -7,
  "Estadio Bahía de San Francisco": -7,
  "MetLife Stadium, Nueva Jersey": -4,
  "Estadio Boston": -4,
  "Estadio Filadelfia": -4,
  "Estadio Miami": -4,
  "Estadio Atlanta": -4,
  "Estadio Houston": -5,
  "AT&T Stadium, Dallas": -5,
  "Estadio Kansas City": -5,
  "BMO Field, Toronto": -4,
};

const CALENDARIO_POR_GRUPO = {
  A: {
    fecha1: { fecha: "2026-06-11", partidos: [{ hora: "13:00", sede: "Estadio Azteca, CDMX" }, { hora: "16:00", sede: "Estadio BBVA, Monterrey" }] },
    fecha2: { fecha: "2026-06-18", partidos: [{ hora: "13:00", sede: "Estadio Akron, Guadalajara" }, { hora: "19:00", sede: "Estadio Akron, Guadalajara" }] },
    fecha3: { fecha: "2026-06-24", partidos: [{ hora: "22:00", sede: "Estadio Azteca, CDMX" }, { hora: "22:00", sede: "Estadio BBVA, Monterrey" }] },
  },
  B: {
    fecha1: { fecha: "2026-06-12", partidos: [{ hora: "12:00", sede: "BC Place, Vancouver" }, { hora: "15:00", sede: "Estadio Seattle" }] },
    fecha2: { fecha: "2026-06-18", partidos: [{ hora: "16:00", sede: "Estadio Los Ángeles" }, { hora: "19:00", sede: "BC Place, Vancouver" }] },
    fecha3: { fecha: "2026-06-24", partidos: [{ hora: "15:00", sede: "BC Place, Vancouver" }, { hora: "15:00", sede: "Estadio Seattle" }] },
  },
  C: {
    fecha1: { fecha: "2026-06-13", partidos: [{ hora: "13:00", sede: "MetLife Stadium, Nueva Jersey" }, { hora: "16:00", sede: "Estadio Boston" }] },
    fecha2: { fecha: "2026-06-19", partidos: [{ hora: "16:00", sede: "Estadio Boston" }, { hora: "19:00", sede: "Estadio Filadelfia" }] },
    fecha3: { fecha: "2026-06-24", partidos: [{ hora: "18:00", sede: "Estadio Miami" }, { hora: "18:00", sede: "Estadio Atlanta" }] },
  },
  D: {
    fecha1: { fecha: "2026-06-19", partidos: [{ hora: "16:00", sede: "Estadio Seattle" }, { hora: "19:00", sede: "Estadio Bahía de San Francisco" }] },
    fecha2: { fecha: "2026-06-22", partidos: [{ hora: "19:00", sede: "Estadio Los Ángeles" }, { hora: "16:00", sede: "Estadio Seattle" }] },
    fecha3: { fecha: "2026-06-25", partidos: [{ hora: "20:00", sede: "Estadio Bahía de San Francisco" }, { hora: "20:00", sede: "Estadio Los Ángeles" }] },
  },
  E: {
    fecha1: { fecha: "2026-06-15", partidos: [{ hora: "13:00", sede: "Estadio Houston" }, { hora: "16:00", sede: "AT&T Stadium, Dallas" }] },
    fecha2: { fecha: "2026-06-20", partidos: [{ hora: "18:00", sede: "Estadio Houston" }, { hora: "21:00", sede: "AT&T Stadium, Dallas" }] },
    fecha3: { fecha: "2026-06-25", partidos: [{ hora: "16:00", sede: "Estadio Houston" }, { hora: "16:00", sede: "AT&T Stadium, Dallas" }] },
  },
  F: {
    fecha1: { fecha: "2026-06-14", partidos: [{ hora: "13:00", sede: "AT&T Stadium, Dallas" }, { hora: "19:00", sede: "Estadio Houston" }] },
    fecha2: { fecha: "2026-06-20", partidos: [{ hora: "16:00", sede: "AT&T Stadium, Dallas" }, { hora: "19:00", sede: "Estadio Houston" }] },
    fecha3: { fecha: "2026-06-25", partidos: [{ hora: "19:00", sede: "AT&T Stadium, Dallas" }, { hora: "19:00", sede: "Estadio Kansas City" }] },
  },
  G: {
    fecha1: { fecha: "2026-06-15", partidos: [{ hora: "13:00", sede: "Estadio Seattle" }, { hora: "16:00", sede: "Estadio Los Ángeles" }] },
    fecha2: { fecha: "2026-06-21", partidos: [{ hora: "15:00", sede: "Estadio Los Ángeles" }, { hora: "21:00", sede: "BC Place, Vancouver" }] },
    fecha3: { fecha: "2026-06-26", partidos: [{ hora: "23:00", sede: "Estadio Seattle" }, { hora: "23:00", sede: "BC Place, Vancouver" }] },
  },
  H: {
    fecha1: { fecha: "2026-06-15", partidos: [{ hora: "13:00", sede: "Estadio Atlanta" }, { hora: "13:00", sede: "Estadio Miami" }] },
    fecha2: { fecha: "2026-06-21", partidos: [{ hora: "12:00", sede: "Estadio Atlanta" }, { hora: "18:00", sede: "Estadio Miami" }] },
    fecha3: { fecha: "2026-06-26", partidos: [{ hora: "19:30", sede: "Estadio Atlanta" }, { hora: "19:30", sede: "Estadio Miami" }] },
  },
  I: {
    fecha1: { fecha: "2026-06-15", partidos: [{ hora: "13:00", sede: "AT&T Stadium, Dallas" }, { hora: "16:00", sede: "Estadio Seattle" }] },
    fecha2: { fecha: "2026-06-22", partidos: [{ hora: "13:00", sede: "AT&T Stadium, Dallas" }, { hora: "13:00", sede: "Estadio Boston" }] },
    fecha3: { fecha: "2026-06-26", partidos: [{ hora: "01:00", sede: "Estadio Boston" }, { hora: "01:00", sede: "AT&T Stadium, Dallas" }] },
  },
  J: {
    fecha1: { fecha: "2026-06-16", partidos: [{ hora: "22:00", sede: "AT&T Stadium, Dallas" }, { hora: "19:00", sede: "Estadio Houston" }] },
    fecha2: { fecha: "2026-06-22", partidos: [{ hora: "14:00", sede: "AT&T Stadium, Dallas" }, { hora: "14:00", sede: "Estadio Houston" }] },
    fecha3: { fecha: "2026-06-27", partidos: [{ hora: "23:00", sede: "Estadio Houston" }, { hora: "19:30", sede: "AT&T Stadium, Dallas" }] },
  },
  K: {
    fecha1: { fecha: "2026-06-17", partidos: [{ hora: "13:00", sede: "Estadio Houston" }, { hora: "22:00", sede: "Estadio Guadalajara" }] },
    fecha2: { fecha: "2026-06-23", partidos: [{ hora: "13:00", sede: "Estadio Houston" }, { hora: "22:00", sede: "Estadio Guadalajara" }] },
    fecha3: { fecha: "2026-06-27", partidos: [{ hora: "19:30", sede: "Estadio Miami" }, { hora: "19:30", sede: "Estadio Atlanta" }] },
  },
  L: {
    fecha1: { fecha: "2026-06-17", partidos: [{ hora: "16:00", sede: "AT&T Stadium, Dallas" }, { hora: "19:00", sede: "BMO Field, Toronto" }] },
    fecha2: { fecha: "2026-06-23", partidos: [{ hora: "16:00", sede: "Estadio Boston" }, { hora: "19:00", sede: "BMO Field, Toronto" }] },
    fecha3: { fecha: "2026-06-27", partidos: [{ hora: "17:00", sede: "MetLife Stadium, Nueva Jersey" }, { hora: "17:00", sede: "Estadio Filadelfia" }] },
  },
};

function crearPartido(config) {
  const offsetHoras = OFFSET_UTC_POR_SEDE[config.sede] ?? 0;
  const instanteUTC = calcularInstanteUTC(config.fecha, config.hora, offsetHoras);

  return {
    id: config.id,
    grupo: config.grupo,
    fecha: config.fecha,
    hora: config.hora,
    zonaHorariaReferencia: "Hora local de la sede",
    instanteUTC,
    sede: config.sede,
    local: config.local,
    visitante: config.visitante,
    golesLocal: null,
    golesVisitante: null,
    definidoEn: "tiempo_regular",
    penalesLocal: null,
    penalesVisitante: null,
    goleadores: [],
    asistencias: [],
    jugado: false,
    eventos: [],
  };
}

function calcularInstanteUTC(fechaISO, horaLocal, offsetHoras) {
  const [anio, mes, dia] = fechaISO.split("-").map(Number);
  const [horas, minutos] = horaLocal.split(":").map(Number);
  const fechaUTC = new Date(Date.UTC(anio, mes - 1, dia, horas - offsetHoras, minutos));
  return fechaUTC.toISOString();
}

function generarPartidosDeGrupo(letraGrupo, equiposDelGrupo) {
  const [e0, e1, e2, e3] = equiposDelGrupo.map((equipo) => equipo.id);
  const calendario = CALENDARIO_POR_GRUPO[letraGrupo];

  const cruces = [
    { fecha: "fecha1", pares: [[e0, e1], [e2, e3]] },
    { fecha: "fecha2", pares: [[e0, e2], [e3, e1]] },
    { fecha: "fecha3", pares: [[e3, e0], [e1, e2]] },
  ];

  const partidos = [];
  cruces.forEach(({ fecha, pares }, indiceFecha) => {
    const datosFecha = calendario[fecha];
    pares.forEach((par, indicePartido) => {
      const datosPartido = datosFecha.partidos[indicePartido];
      partidos.push(
        crearPartido({
          id: `${letraGrupo}${indiceFecha + 1}${indicePartido + 1}`,
          grupo: letraGrupo,
          fecha: datosFecha.fecha,
          hora: datosPartido.hora,
          sede: datosPartido.sede,
          local: par[0],
          visitante: par[1],
        })
      );
    });
  });
  return partidos;
}

function generarFixtureCompleto() {
  let todosLosPartidos = [];
  GRUPOS.forEach((letraGrupo) => {
    const equiposDelGrupo = obtenerEquiposPorGrupo(letraGrupo);
    todosLosPartidos = todosLosPartidos.concat(generarPartidosDeGrupo(letraGrupo, equiposDelGrupo));
  });
  return todosLosPartidos;
}

const PARTIDOS_GRUPOS = generarFixtureCompleto();

function obtenerPartidosPorGrupo(letraGrupo) {
  return PARTIDOS_GRUPOS.filter((partido) => partido.grupo === letraGrupo);
}

function obtenerPartidosOrdenados() {
  return [...PARTIDOS_GRUPOS].sort((a, b) => {
    const fechaHoraA = `${a.fecha} ${a.hora}`;
    const fechaHoraB = `${b.fecha} ${b.hora}`;
    return fechaHoraA.localeCompare(fechaHoraB);
  });
}

function obtenerPartidoPorId(id) {
  return PARTIDOS_GRUPOS.find((partido) => partido.id === id) || null;
}
