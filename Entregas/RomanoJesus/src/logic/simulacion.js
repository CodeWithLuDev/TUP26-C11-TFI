function simularPartido(idPartido) {
  const estado = obtenerEstadoTorneo();
  const partido = estado.partidos.find(p => p.id === idPartido);
  if (!partido) return;

  const local = obtenerEquipoPorId(partido.local);
  const visitante = obtenerEquipoPorId(partido.visitante);
  if (!local || !visitante) return;

  const golesLocal = Math.floor(Math.random() * 5);
  const golesVisitante = Math.floor(Math.random() * 5);

  const NOMBRES_FALLBACK = ["García", "Martínez", "López", "González", "Rodríguez", "Fernández", "Pérez", "Silva", "Torres", "Romero", "Cruz", "Ortiz", "Díaz", "Moreno", "Álvarez", "Muñoz"];

  const plantelLocal = JUGADORES_DESTACADOS.filter(j => j.equipoId === partido.local);
  const plantelVisit = JUGADORES_DESTACADOS.filter(j => j.equipoId === partido.visitante);

  const plantelConFallback = (plantel, equipoId) => {
    if (plantel.length > 0) return plantel;
    return NOMBRES_FALLBACK.map((n, i) => ({ nombre: n, edad: 27, equipoId, club: "", liga: "", posicion: "Jugador", golesTrayectoria: 0 }));
  };

  const goleadores = [];
  const asistencias = [];
  const eventos = [];

  function jugadorRandom(lista, excluir) {
    const filtrada = excluir ? lista.filter(j => j.nombre !== excluir) : lista;
    if (filtrada.length === 0) return null;
    return filtrada[Math.floor(Math.random() * filtrada.length)];
  }

  function generarGol(equipoId, jugadoresDelEquipo, minBase) {
    const min = Math.max(1, Math.min(120, minBase + Math.floor(Math.random() * 15)));
    const j = jugadorRandom(jugadoresDelEquipo);
    const nombre = j ? j.nombre : "Jugador";
    const esPenal = Math.random() < 0.08;
    const esPropia = Math.random() < 0.03;
    const tipoGol = esPropia ? "propia" : "gol";
    const eq = esPropia
      ? (equipoId === partido.local ? partido.visitante : partido.local)
      : equipoId;
    const desc = esPenal ? `${nombre} (pen.)` : esPropia ? `${nombre} (en contra)` : `Gol de ${nombre}`;
    if (!esPropia) {
      goleadores.push({ jugador: nombre, equipoId });
    } else {
      goleadores.push({ jugador: nombre, equipoId: eq });
    }
    eventos.push({
      minuto: min, tipo: tipoGol, jugador: nombre,
      equipoId: eq, descripcion: desc,
    });
    const asist = jugadorRandom(jugadoresDelEquipo, nombre);
    if (asist && Math.random() < 0.65 && !esPropia) {
      asistencias.push({ jugador: asist.nombre, equipoId });
    }
  }

  function generarTarjeta(equipoId, jugadoresDelEquipo, minBase, tipo) {
    const min = Math.max(1, Math.min(120, minBase + Math.floor(Math.random() * 15)));
    const j = jugadorRandom(jugadoresDelEquipo);
    if (!j) return;
    const desc = tipo === "amarilla" ? `${j.nombre} — Tarjeta amarilla` : `${j.nombre} — Tarjeta roja`;
    eventos.push({ minuto: min, tipo, jugador: j.nombre, equipoId, descripcion: desc });
  }

  function generarCambio(equipoId, jugadoresDelEquipo, minBase) {
    if (jugadoresDelEquipo.length < 2) return;
    const sale = jugadorRandom(jugadoresDelEquipo);
    const entra = jugadorRandom(jugadoresDelEquipo, sale?.nombre);
    if (!sale || !entra) return;
    const min = Math.max(1, Math.min(120, minBase + Math.floor(Math.random() * 10)));
    eventos.push({ minuto: min, tipo: "sust", jugador: sale.nombre, equipoId, descripcion: `Sale ${sale.nombre}, entra ${entra.nombre}` });
  }

  const plantelConFallbackLocal = plantelConFallback(plantelLocal, partido.local);
  const plantelConFallbackVisit = plantelConFallback(plantelVisit, partido.visitante);

  const totalGoles = golesLocal + golesVisitante;
  let minutoActual = 1;
  for (let i = 0; i < totalGoles; i++) {
    const lado = i < golesLocal ? partido.local : partido.visitante;
    const plantel = lado === partido.local ? plantelConFallbackLocal : plantelConFallbackVisit;
    generarGol(lado, plantel, minutoActual);
    minutoActual += Math.floor(70 / Math.max(1, totalGoles)) + Math.floor(Math.random() * 20);
  }

  if (Math.random() < 0.3) generarTarjeta(partido.local, plantelConFallbackLocal, 20, "amarilla");
  if (Math.random() < 0.3) generarTarjeta(partido.visitante, plantelConFallbackVisit, 25, "amarilla");
  if (Math.random() < 0.05) generarTarjeta(partido.local, plantelConFallbackLocal, 50, "roja");
  if (Math.random() < 0.08) generarTarjeta(partido.visitante, plantelConFallbackVisit, 55, "roja");
  if (plantelConFallbackLocal.length > 2 && Math.random() < 0.5) generarCambio(partido.local, plantelConFallbackLocal, 55);
  if (plantelConFallbackVisit.length > 2 && Math.random() < 0.5) generarCambio(partido.visitante, plantelConFallbackVisit, 60);

  eventos.sort((a, b) => a.minuto - b.minuto);

  const jugado = true;
  const definidoEn = golesLocal !== golesVisitante ? "tiempo_regular" : (Math.random() < 0.5 ? "tiempo_extra" : "penales");
  const penales = definidoEn === "penales" ? { local: 4 + Math.floor(Math.random() * 3), visitante: 4 + Math.floor(Math.random() * 3) } : { local: null, visitante: null };
  if (penales.local !== null && penales.local === penales.visitante) penales.local += 1;

  actualizarPartido(idPartido, {
    golesLocal, golesVisitante, jugado, definidoEn,
    penalesLocal: penales.local, penalesVisitante: penales.visitante,
    goleadores, asistencias, eventos,
  });
}

function simularFaseGrupos() {
  const estado = obtenerEstadoTorneo();
  estado.partidos.forEach(p => { if (!p.jugado) simularPartido(p.id); });
  guardarYPersistir(estado);
}

function simularPlayoffs() {
  const estado = obtenerEstadoTorneo();
  const tablasPorGrupo = {};
  GRUPOS.forEach(g => {
    const eqs = obtenerEquiposPorGrupo(g);
    const pts = estado.partidos.filter(p => p.grupo === g);
    tablasPorGrupo[g] = calcularTablaDeGrupo(eqs, pts);
  });
  const clasif = calcularClasificacionAOctavos(null, tablasPorGrupo);
  if (!clasif.fasesGruposCompleta) return false;

  const clasificados16 = armarListaDe16(clasif);
  estado.bracket = crearBracketInicial(clasificados16);

  function simularLlave(llave) {
    if (!llave || !llave.equipoLocal || !llave.equipoVisitante) return;
    const gL = Math.floor(Math.random() * 4);
    const gV = Math.floor(Math.random() * 4);
    llave.golesLocal = gL;
    llave.golesVisitante = gV;
    if (gL === gV) {
      llave.penalesLocal = 4 + Math.floor(Math.random() * 3);
      llave.penalesVisitante = 4 + Math.floor(Math.random() * 3);
      if (llave.penalesLocal === llave.penalesVisitante) llave.penalesLocal += 1;
    }
    llave.jugado = true;
  }

  estado.bracket.octavos.forEach(simularLlave);
  propagarGanadores(estado.bracket);
  estado.bracket.cuartos.forEach(simularLlave);
  propagarGanadores(estado.bracket);
  estado.bracket.semis.forEach(simularLlave);
  propagarGanadores(estado.bracket);
  estado.bracket.final.forEach(simularLlave);
  estado.bracket.tercerPuesto.forEach(simularLlave);
  propagarGanadores(estado.bracket);

  guardarYPersistir(estado);
  return true;
}

function simularTodo() {
  if (!confirm("¿Simular automáticamente TODOS los partidos del torneo?")) return;
  simularFaseGrupos();
  simularPlayoffs();
  refrescarVistaActual();
}

function borrarResultados() {
  if (!confirm("¿Borrar todos los resultados cargados y el bracket?")) return;
  const estado = obtenerEstadoTorneo();
  estado.partidos.forEach(p => {
    p.golesLocal = null;
    p.golesVisitante = null;
    p.jugado = false;
    p.goleadores = [];
    p.asistencias = [];
    p.eventos = [];
    p.definidoEn = "tiempo_regular";
    p.penalesLocal = null;
    p.penalesVisitante = null;
  });
  estado.bracket = null;
  guardarYPersistir(estado);
  refrescarVistaActual();
}