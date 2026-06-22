/**
 * playoffs.js
 * Determina quién clasifica de la fase de grupos (2 primeros de cada grupo
 * + los 8 mejores terceros) y construye/actualiza el bracket de eliminación
 * directa: Octavos -> Cuartos -> Semifinales -> Final (+ tercer puesto).
 *
 * Nota: por simplicidad pedagógica (según lo definido para este TP), el
 * bracket arranca directamente en OCTAVOS con los 16 clasificados, en vez
 * de la ronda de 32 que usa el Mundial 2026 real.
 */

/**
 * Dado el estado completo del torneo, devuelve:
 *  - clasificadosPorGrupo: { [grupo]: tabla ordenada con sus 4 filas }
 *  - primerosYsegundos: array de 24 equipos (1° y 2° de cada grupo)
 *  - tercerosOrdenados: array de los 12 terceros, ordenados por su propio mérito
 *  - mejoresTerceros: los 8 mejores terceros que también clasifican
 *  - fasesGruposCompleta: true si los 12 grupos ya jugaron sus 6 partidos
 */
function calcularClasificacionAOctavos(equiposPorGrupo, tablasPorGrupo) {
  const primerosYsegundos = [];
  const terceros = [];

  GRUPOS.forEach((letraGrupo) => {
    const tabla = tablasPorGrupo[letraGrupo];
    if (!tabla || tabla.length < 4) return;
    primerosYsegundos.push({ ...tabla[0], grupo: letraGrupo, posicionEnGrupo: 1 });
    primerosYsegundos.push({ ...tabla[1], grupo: letraGrupo, posicionEnGrupo: 2 });
    terceros.push({ ...tabla[2], grupo: letraGrupo, posicionEnGrupo: 3 });
  });

  const tercerosOrdenados = [...terceros].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dg !== a.dg) return b.dg - a.dg;
    return b.gf - a.gf;
  });

  const mejoresTerceros = tercerosOrdenados.slice(0, 8);

  const fasesGruposCompleta = GRUPOS.every((letraGrupo) => {
    const tabla = tablasPorGrupo[letraGrupo];
    return tabla && tabla.every((fila) => fila.pj === 3);
  });

  return {
    primerosYsegundos,
    tercerosOrdenados,
    mejoresTerceros,
    fasesGruposCompleta,
  };
}

/**
 * Determina el ganador de un partido de eliminación directa.
 * En tiempo regular: gana quien metió más goles.
 * Si hay empate, se resuelve por penalesLocal/penalesVisitante (si están cargados).
 */
function obtenerGanadorPartido(partido) {
  if (!partido.jugado) return null;
  if (partido.golesLocal > partido.golesVisitante) return partido.equipoLocal ? partido.equipoLocal.equipoId : partido.local;
  if (partido.golesVisitante > partido.golesLocal) return partido.equipoVisitante ? partido.equipoVisitante.equipoId : partido.visitante;
  if (partido.penalesLocal !== null && partido.penalesVisitante !== null) {
    const ganador = partido.penalesLocal > partido.penalesVisitante
      ? (partido.equipoLocal || partido.local)
      : (partido.equipoVisitante || partido.visitante);
    return ganador && typeof ganador === "object" ? ganador.equipoId : ganador;
  }
  return null;
}

/**
 * Crea la estructura inicial del bracket (16 cupos en Octavos) a partir de
 * los 16 clasificados, en un orden de cruces fijo y simple.
  * equipos16: array de 16 objetos { equipoId, nombre, codigoIso }
 */
function crearBracketInicial(equipos16) {
  const octavos = [];
  for (let i = 0; i < 8; i++) {
    octavos.push({
      id: `OCT${i + 1}`,
      ronda: "octavos",
      equipoLocal: equipos16[i * 2] || null,
      equipoVisitante: equipos16[i * 2 + 1] || null,
      golesLocal: null,
      golesVisitante: null,
      penalesLocal: null,
      penalesVisitante: null,
      jugado: false,
    });
  }

  const cuartos = Array.from({ length: 4 }, (_, i) => crearLlaveVacia(`CUA${i + 1}`, "cuartos"));
  const semis = Array.from({ length: 2 }, (_, i) => crearLlaveVacia(`SEM${i + 1}`, "semifinal"));
  const final = [crearLlaveVacia("FIN1", "final")];
  const tercerPuesto = [crearLlaveVacia("3P1", "tercer_puesto")];

  return { octavos, cuartos, semis, final, tercerPuesto };
}

function crearLlaveVacia(id, ronda) {
  return {
    id,
    ronda,
    equipoLocal: null,
    equipoVisitante: null,
    golesLocal: null,
    golesVisitante: null,
    penalesLocal: null,
    penalesVisitante: null,
    jugado: false,
  };
}

/**
 * Propaga los ganadores de una ronda a la siguiente ronda del bracket.
 * Debe llamarse cada vez que se confirma el resultado de un partido eliminatorio.
 */
function propagarGanadores(bracket) {
  propagarRonda(bracket.octavos, bracket.cuartos);
  propagarRonda(bracket.cuartos, bracket.semis);
  propagarRonda(bracket.semis, bracket.final, bracket.tercerPuesto);
}

function propagarRonda(rondaActual, siguienteRonda, rondaTercerPuesto) {
  for (let i = 0; i < rondaActual.length; i += 2) {
    const partidoA = rondaActual[i];
    const partidoB = rondaActual[i + 1];
    if (!partidoA || !partidoB) continue;

    const llaveDestino = siguienteRonda[i / 2];
    if (!llaveDestino) continue;

    const ganadorA = obtenerGanadorPartido(partidoA);
    const ganadorB = obtenerGanadorPartido(partidoB);

    llaveDestino.equipoLocal = ganadorA ? buscarEquipoEnPartido(partidoA, ganadorA) : null;
    llaveDestino.equipoVisitante = ganadorB ? buscarEquipoEnPartido(partidoB, ganadorB) : null;

    // Si estamos propagando semifinales, los perdedores van al partido por el 3er puesto
    if (rondaTercerPuesto) {
      const perdedorA = obtenerGanadorPartido(partidoA) ? obtenerPerdedor(partidoA, ganadorA) : null;
      const perdedorB = obtenerGanadorPartido(partidoB) ? obtenerPerdedor(partidoB, ganadorB) : null;
      rondaTercerPuesto[0].equipoLocal = perdedorA;
      rondaTercerPuesto[0].equipoVisitante = perdedorB;
    }
  }
}

function buscarEquipoEnPartido(partido, equipoId) {
  if (partido.equipoLocal && partido.equipoLocal.equipoId === equipoId) return partido.equipoLocal;
  if (partido.equipoVisitante && partido.equipoVisitante.equipoId === equipoId) return partido.equipoVisitante;
  return null;
}

function obtenerPerdedor(partido, ganadorId) {
  if (!partido.equipoLocal || !partido.equipoVisitante) return null;
  return partido.equipoLocal.equipoId === ganadorId ? partido.equipoVisitante : partido.equipoLocal;
}

function mapearAFormatoLlave(filaClasificada) {
  if (!filaClasificada) return null;
  const equipo = obtenerEquipoPorId(filaClasificada.equipoId);
  if (!equipo) return { equipoId: null, nombre: "—", codigoIso: null };
  return { equipoId: filaClasificada.equipoId, nombre: equipo.nombre, codigoIso: equipo.codigoIso };
}

function armarListaDe16(clasificacion) {
  const primeros = clasificacion.primerosYsegundos.filter((e) => e.posicionEnGrupo === 1);
  const segundos = clasificacion.primerosYsegundos.filter((e) => e.posicionEnGrupo === 2);
  const terceros = clasificacion.mejoresTerceros;
  const lista16 = [];
  for (let i = 0; i < 8; i++) {
    lista16.push(mapearAFormatoLlave(primeros[i]));
    lista16.push(mapearAFormatoLlave(segundos[(i + 1) % segundos.length] || terceros[i % terceros.length]));
  }
  return lista16.slice(0, 16);
}
