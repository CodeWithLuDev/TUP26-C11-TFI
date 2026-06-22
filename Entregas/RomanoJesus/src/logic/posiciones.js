/**
 * posiciones.js
 * Cálculo de la tabla de posiciones de un grupo y aplicación de los
 * criterios de desempate reglamentarios (orden FIFA).
 *
 * Esta lógica es independiente de la interfaz: recibe datos crudos
 * (equipos + partidos) y devuelve una tabla ya ordenada, sin tocar el DOM.
 */

/** Crea una fila vacía de estadísticas para un equipo */
function crearFilaVacia(equipo) {
  return {
    equipoId: equipo.id,
    nombre: equipo.nombre,
    pj: 0, // partidos jugados
    pg: 0, // partidos ganados
    pe: 0, // partidos empatados
    pp: 0, // partidos perdidos
    gf: 0, // goles a favor
    gc: 0, // goles en contra
    dg: 0, // diferencia de goles
    pts: 0, // puntos
  };
}

/** Aplica el resultado de un partido jugado a las filas de ambos equipos */
function aplicarResultadoAFila(fila, golesPropios, golesRival) {
  fila.pj += 1;
  fila.gf += golesPropios;
  fila.gc += golesRival;
  fila.dg = fila.gf - fila.gc;

  if (golesPropios > golesRival) {
    fila.pg += 1;
    fila.pts += 3;
  } else if (golesPropios === golesRival) {
    fila.pe += 1;
    fila.pts += 1;
  } else {
    fila.pp += 1;
  }
}

/**
 * Calcula la tabla de posiciones de un grupo a partir de sus equipos y partidos.
 * Solo considera partidos con jugado === true.
 */
function calcularTablaDeGrupo(equiposDelGrupo, partidosDelGrupo) {
  const tabla = {};
  equiposDelGrupo.forEach((equipo) => {
    tabla[equipo.id] = crearFilaVacia(equipo);
  });

  partidosDelGrupo
    .filter((partido) => partido.jugado)
    .forEach((partido) => {
      // En la fase de grupos no hay tiempo extra/penales: el desempate de partido
      // en sí no aplica acá (eso es para llaves eliminatorias). Solo se usa el
      // resultado en tiempo regular para puntos y goles.
      aplicarResultadoAFila(tabla[partido.local], partido.golesLocal, partido.golesVisitante);
      aplicarResultadoAFila(tabla[partido.visitante], partido.golesVisitante, partido.golesLocal);
    });

  const filas = Object.values(tabla);
  return ordenarTablaConDesempates(filas, partidosDelGrupo);
}

/**
 * Ordena las filas de una tabla aplicando, en orden, los criterios FIFA:
 * 1) Puntos
 * 2) Diferencia de goles
 * 3) Goles a favor
 * 4) Resultado del enfrentamiento directo (solo entre los empatados)
 * 5) Si persiste el empate, se marca para sorteo/decisión de cátedra
 */
function ordenarTablaConDesempates(filas, partidosDelGrupo) {
  const filasOrdenadas = [...filas].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dg !== a.dg) return b.dg - a.dg;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return 0; // posible empate total, se resuelve por grupos abajo
  });

  // Detecta bloques de equipos completamente empatados en pts/dg/gf
  // y los reordena según el resultado del enfrentamiento directo entre ellos.
  let indice = 0;
  while (indice < filasOrdenadas.length) {
    let finBloque = indice;
    while (
      finBloque + 1 < filasOrdenadas.length &&
      estanEmpatados(filasOrdenadas[indice], filasOrdenadas[finBloque + 1])
    ) {
      finBloque += 1;
    }

    if (finBloque > indice) {
      const bloque = filasOrdenadas.slice(indice, finBloque + 1);
      const bloqueResuelto = resolverPorEnfrentamientoDirecto(bloque, partidosDelGrupo);
      for (let i = 0; i < bloqueResuelto.length; i++) {
        filasOrdenadas[indice + i] = bloqueResuelto[i];
      }
    }
    indice = finBloque + 1;
  }

  return filasOrdenadas;
}

function estanEmpatados(filaA, filaB) {
  return filaA.pts === filaB.pts && filaA.dg === filaB.dg && filaA.gf === filaB.gf;
}

/**
 * Dentro de un bloque de equipos empatados, calcula una mini-tabla
 * usando solo los partidos jugados entre ellos (enfrentamiento directo).
 * Si el empate persiste incluso ahí, mantiene el orden y lo señala
 * como "pendiente de sorteo / decisión de cátedra".
 */
function resolverPorEnfrentamientoDirecto(bloqueEmpatado, partidosDelGrupo) {
  const idsBloque = bloqueEmpatado.map((fila) => fila.equipoId);
  const miniTabla = {};
  idsBloque.forEach((id) => {
    miniTabla[id] = { equipoId: id, pts: 0, dg: 0, gf: 0 };
  });

  partidosDelGrupo
    .filter(
      (partido) =>
        partido.jugado &&
        idsBloque.includes(partido.local) &&
        idsBloque.includes(partido.visitante)
    )
    .forEach((partido) => {
      const filaLocal = miniTabla[partido.local];
      const filaVisitante = miniTabla[partido.visitante];
      filaLocal.gf += partido.golesLocal;
      filaVisitante.gf += partido.golesVisitante;
      filaLocal.dg += partido.golesLocal - partido.golesVisitante;
      filaVisitante.dg += partido.golesVisitante - partido.golesLocal;
      if (partido.golesLocal > partido.golesVisitante) filaLocal.pts += 3;
      else if (partido.golesLocal < partido.golesVisitante) filaVisitante.pts += 3;
      else {
        filaLocal.pts += 1;
        filaVisitante.pts += 1;
      }
    });

  const ordenPorMiniTabla = [...bloqueEmpatado].sort((a, b) => {
    const miniA = miniTabla[a.equipoId];
    const miniB = miniTabla[b.equipoId];
    if (miniB.pts !== miniA.pts) return miniB.pts - miniA.pts;
    if (miniB.dg !== miniA.dg) return miniB.dg - miniA.dg;
    if (miniB.gf !== miniA.gf) return miniB.gf - miniA.gf;
    return 0; // empate total persistente: requiere sorteo/decisión de cátedra
  });

  return ordenPorMiniTabla;
}
