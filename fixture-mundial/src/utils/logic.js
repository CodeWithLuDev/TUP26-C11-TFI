
export function calculateGroupStandings(equipos, partidos, grupo) {

  // 1. Filtrar solo los equipos y partidos de este grupo
  const equiposDelGrupo = equipos.filter(e => e.grupo === grupo);
  const partidosDelGrupo = partidos.filter(
    p => p.grupo === grupo && p.estado === "finalizado"
  );

  const tabla = equiposDelGrupo.map(equipo => {

    const misPartidos = partidosDelGrupo.filter(
      p => p.id_local === equipo.id || p.id_visitante === equipo.id
    );

    // Inicializar contadores
    let PJ = 0; // Partidos Jugados
    let PG = 0; // Partidos Ganados
    let PE = 0; // Partidos Empatados
    let PP = 0; // Partidos Perdidos
    let GF = 0; // Goles a Favor
    let GC = 0; // Goles en Contra

    misPartidos.forEach(partido => {
      const esLocal = partido.id_local === equipo.id;

      const golesAFavor  = esLocal ? partido.goles_local      : partido.goles_visitante;
      const golesEnContra = esLocal ? partido.goles_visitante  : partido.goles_local;

      PJ += 1;
      GF += golesAFavor;
      GC += golesEnContra;

      if (golesAFavor > golesEnContra) PG += 1;
      else if (golesAFavor === golesEnContra) PE += 1;
      else PP += 1;
    });

    const DG  = GF - GC;      
    const PTS = PG * 3 + PE;  

    return {
      id:      equipo.id,
      nombre:  equipo.nombre,
      bandera: equipo.bandera,
      grupo:   equipo.grupo,
      PJ, PG, PE, PP, GF, GC, DG, PTS,
    };
  });

  
  tabla.sort((a, b) => {
    if (b.PTS !== a.PTS) return b.PTS - a.PTS;

    if (b.DG !== a.DG) return b.DG - a.DG;

    return b.GF - a.GF;
  });

  return tabla;
}



export function getMatchResult(partido) {
  if (partido.goles_local === null || partido.goles_visitante === null) {
    return null; // partido no jugado todavía
  }
  if (partido.goles_local > partido.goles_visitante) return "local";
  if (partido.goles_local < partido.goles_visitante) return "visitante";
  return "empate";
}


export function getEquipoById(equipos, id) {
  return equipos.find(e => e.id === id) || null;
}



export function getPartidosByFase(partidos, fase) {
  return partidos.filter(p => p.fase === fase);
}


