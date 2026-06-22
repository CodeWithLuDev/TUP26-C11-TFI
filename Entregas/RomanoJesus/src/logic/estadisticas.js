/**
 * estadisticas.js
 * Mantiene y calcula los rankings de goleadores y asistidores del torneo
 * a partir de los goles/asistencias registrados en cada partido.
 */

/**
 * Recorre todos los partidos (de grupos y de playoffs) y devuelve
 * el top de goleadores ordenado de mayor a menor cantidad de goles.
 */
function calcularTopGoleadores(todosLosPartidos) {
  const conteo = {};

  todosLosPartidos
    .filter((partido) => partido.jugado)
    .forEach((partido) => {
      (partido.goleadores || []).forEach((gol) => {
        const clave = `${gol.jugador}__${gol.equipoId}`;
        if (!conteo[clave]) {
          conteo[clave] = { jugador: gol.jugador, equipoId: gol.equipoId, goles: 0 };
        }
        conteo[clave].goles += 1;
      });
    });

  return Object.values(conteo).sort((a, b) => b.goles - a.goles);
}

/**
 * Recorre todos los partidos y devuelve el top de asistidores
 * ordenado de mayor a menor cantidad de asistencias.
 */
function calcularTopAsistidores(todosLosPartidos) {
  const conteo = {};

  todosLosPartidos
    .filter((partido) => partido.jugado)
    .forEach((partido) => {
      (partido.asistencias || []).forEach((asistencia) => {
        const clave = `${asistencia.jugador}__${asistencia.equipoId}`;
        if (!conteo[clave]) {
          conteo[clave] = { jugador: asistencia.jugador, equipoId: asistencia.equipoId, asistencias: 0 };
        }
        conteo[clave].asistencias += 1;
      });
    });

  return Object.values(conteo).sort((a, b) => b.asistencias - a.asistencias);
}
