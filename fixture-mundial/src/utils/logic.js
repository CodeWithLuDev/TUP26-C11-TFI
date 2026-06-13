// =============================================
// src/utils/logic.js
// =============================================

export function calculateGroupStandings(equipos, partidos, grupo) {
  const equiposDelGrupo  = equipos.filter(e => e.grupo === grupo);
  const partidosDelGrupo = partidos.filter(p => p.grupo === grupo && p.estado === "finalizado");

  const tabla = equiposDelGrupo.map(equipo => {
    const misPartidos = partidosDelGrupo.filter(
      p => p.id_local === equipo.id || p.id_visitante === equipo.id
    );
    let PJ=0, PG=0, PE=0, PP=0, GF=0, GC=0;
    misPartidos.forEach(p => {
      const esLocal       = p.id_local === equipo.id;
      const golesAFavor   = esLocal ? p.goles_local     : p.goles_visitante;
      const golesEnContra = esLocal ? p.goles_visitante : p.goles_local;
      PJ++; GF += golesAFavor; GC += golesEnContra;
      if (golesAFavor > golesEnContra) PG++;
      else if (golesAFavor === golesEnContra) PE++;
      else PP++;
    });
    const DG = GF - GC, PTS = PG*3 + PE;
    return { id: equipo.id, nombre: equipo.nombre, bandera: equipo.bandera, grupo: equipo.grupo, PJ, PG, PE, PP, GF, GC, DG, PTS };
  });

  tabla.sort((a,b) => b.PTS !== a.PTS ? b.PTS-a.PTS : b.DG !== a.DG ? b.DG-a.DG : b.GF-a.GF);
  return tabla;
}

export function getMatchResult(partido) {
  if (partido.goles_local === null || partido.goles_visitante === null) return null;
  if (partido.goles_local > partido.goles_visitante) return "local";
  if (partido.goles_local < partido.goles_visitante) return "visitante";
  return "empate";
}

export function getEquipoById(equipos, id) { return equipos.find(e => e.id === id) || null; }
export function getPartidosByFase(partidos, fase) { return partidos.filter(p => p.fase === fase); }

// ----------------------------
// RANKING FIFA
// ----------------------------
const RANKING_FIFA = {
  e01:16, e02:65, e03:23, e04:37, e05:47, e06:19, e07:58, e08:62,
  e09:5,  e10:14, e11:83, e12:39, e13:13, e14:52, e15:24, e16:29,
  e17:4,  e18:81, e19:48, e20:44, e21:7,  e22:18, e23:55, e24:25,
  e25:3,  e26:34, e27:21, e28:97, e29:8,  e30:73, e31:56, e32:17,
  e33:2,  e34:70, e35:12, e36:79, e37:1,  e38:30, e39:22, e40:88,
  e41:6,  e42:9,  e43:66, e44:54, e45:11, e46:10, e47:60, e48:78,
};

function getFuerza(id) {
  const r = RANKING_FIFA[id] || 50;
  return Math.max(0.20, Math.min(0.90, 1 - (r-1)/110));
}

function golesConFuerza(fuerzaAtaque, fuerzaRival) {
  const ventaja = fuerzaAtaque - fuerzaRival;
  const media   = 1.2 + ventaja * 1.5;
  const r = Math.random();
  if (media < 0.8)       { if(r<.55)return 0; if(r<.80)return 1; if(r<.93)return 2; return 3; }
  else if (media < 1.2)  { if(r<.35)return 0; if(r<.65)return 1; if(r<.83)return 2; if(r<.94)return 3; return 4; }
  else if (media < 1.6)  { if(r<.22)return 0; if(r<.52)return 1; if(r<.76)return 2; if(r<.90)return 3; if(r<.97)return 4; return 5; }
  else                   { if(r<.10)return 0; if(r<.30)return 1; if(r<.55)return 2; if(r<.75)return 3; if(r<.88)return 4; if(r<.96)return 5; return 6; }
}

function simularConRanking(idLocal, idVisitante) {
  return {
    gl: golesConFuerza(getFuerza(idLocal),     getFuerza(idVisitante)),
    gv: golesConFuerza(getFuerza(idVisitante), getFuerza(idLocal)),
  };
}

function simularEliminatoria(idLocal, idVisitante) {
  let { gl, gv } = simularConRanking(idLocal, idVisitante);
  if (gl === gv) {
    if (getFuerza(idLocal) >= getFuerza(idVisitante)) gl++;
    else gv++;
  }
  return { gl, gv };
}

// ----------------------------
// CLASIFICADOS
// ----------------------------
const GRUPOS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

function getMejoresTerceros(equipos, partidos) {
  const terceros = GRUPOS.map(g => {
    const t = calculateGroupStandings(equipos, partidos, g);
    return t[2] || null;
  }).filter(Boolean);
  terceros.sort((a,b) => b.PTS!==a.PTS ? b.PTS-a.PTS : b.DG!==a.DG ? b.DG-a.DG : b.GF-a.GF);
  return terceros.slice(0, 8);
}

export function getClasificados(equipos, partidos) {
  const primeros=[], segundos=[];
  GRUPOS.forEach(g => {
    const t = calculateGroupStandings(equipos, partidos, g);
    if (t[0]) primeros.push(t[0].id);
    if (t[1]) segundos.push(t[1].id);
  });
  const terceros = getMejoresTerceros(equipos, partidos).map(e => e.id);
  return [...primeros, ...segundos, ...terceros]; // 32 clasificados
}

// ----------------------------
// SIMULACIÓN COMPLETA
// ----------------------------
export function simularTorneoCompleto(equipos, partidos, jugadores) {
  let ps = [...partidos];
  const goleadores = [];

  function asignar(partidoId, equipoId, cantidad) {
    const plantel = (jugadores[equipoId]||[]).filter(j=>j.posicion!=="AR");
    for (let i=0; i<cantidad; i++) {
      if (!plantel.length) continue;
      const j = plantel[Math.floor(Math.random()*plantel.length)].nombre;
      const idx = goleadores.findIndex(g=>g.partidoId===partidoId&&g.equipoId===equipoId&&g.jugador===j);
      if (idx>=0) goleadores[idx].cantidad++;
      else goleadores.push({partidoId, equipoId, jugador:j, cantidad:1});
    }
  }

  // 1. Grupos
  ps = ps.map(p => {
    if (p.fase!=="Grupos"||p.estado==="finalizado"||!p.id_local||!p.id_visitante) return p;
    const {gl,gv} = simularConRanking(p.id_local, p.id_visitante);
    asignar(p.id, p.id_local,     gl);
    asignar(p.id, p.id_visitante, gv);
    return {...p, goles_local:gl, goles_visitante:gv, estado:"finalizado"};
  });

  // 2. Clasificados (32)
  const clas = getClasificados(equipos, ps);
  // clas[0..11]  = 1ros de A-L
  // clas[12..23] = 2dos de A-L
  // clas[24..31] = 8 mejores 3ros
  // Emparejamiento: 1°A vs mejor3°, 2°A vs 2°B, etc. (simplificado: i vs 31-i)

  // 3. 16avos (32 → 16)
  const ids16 = ["R32_1","R32_2","R32_3","R32_4","R32_5","R32_6","R32_7","R32_8",
                 "R32_9","R32_10","R32_11","R32_12","R32_13","R32_14","R32_15","R32_16"];

  ps = ps.map(p => {
    const idx = ids16.indexOf(p.id);
    if (idx===-1) return p;
    const local     = clas[idx];
    const visitante = clas[31-idx];
    if (!local||!visitante) return p;
    const {gl,gv} = simularEliminatoria(local, visitante);
    asignar(p.id, local,     gl);
    asignar(p.id, visitante, gv);
    return {...p, id_local:local, id_visitante:visitante, goles_local:gl, goles_visitante:gv, estado:"finalizado"};
  });

  const gan = id => { const p=ps.find(x=>x.id===id); if(!p) return null; return p.goles_local>p.goles_visitante?p.id_local:p.id_visitante; };
  const per = id => { const p=ps.find(x=>x.id===id); if(!p) return null; return p.goles_local>p.goles_visitante?p.id_visitante:p.id_local; };

  // 4. Octavos (16 → 8)
  const idsOct = ["OCT1","OCT2","OCT3","OCT4","OCT5","OCT6","OCT7","OCT8"];
  const empOct = [
    [gan("R32_1"),  gan("R32_2")],  [gan("R32_3"),  gan("R32_4")],
    [gan("R32_5"),  gan("R32_6")],  [gan("R32_7"),  gan("R32_8")],
    [gan("R32_9"),  gan("R32_10")], [gan("R32_11"), gan("R32_12")],
    [gan("R32_13"), gan("R32_14")], [gan("R32_15"), gan("R32_16")],
  ];
  ps = ps.map(p => {
    const idx = idsOct.indexOf(p.id);
    if (idx===-1) return p;
    const [local,visitante] = empOct[idx];
    if (!local||!visitante) return p;
    const {gl,gv} = simularEliminatoria(local, visitante);
    asignar(p.id, local, gl); asignar(p.id, visitante, gv);
    return {...p, id_local:local, id_visitante:visitante, goles_local:gl, goles_visitante:gv, estado:"finalizado"};
  });

  // 5. Cuartos (8 → 4)
  const idsCua = ["CUA1","CUA2","CUA3","CUA4"];
  const empCua = [
    [gan("OCT1"), gan("OCT2")], [gan("OCT3"), gan("OCT4")],
    [gan("OCT5"), gan("OCT6")], [gan("OCT7"), gan("OCT8")],
  ];
  ps = ps.map(p => {
    const idx = idsCua.indexOf(p.id);
    if (idx===-1) return p;
    const [local,visitante] = empCua[idx];
    if (!local||!visitante) return p;
    const {gl,gv} = simularEliminatoria(local, visitante);
    asignar(p.id, local, gl); asignar(p.id, visitante, gv);
    return {...p, id_local:local, id_visitante:visitante, goles_local:gl, goles_visitante:gv, estado:"finalizado"};
  });

  // 6. Semis (4 → 2)
  const idsSem = ["SEM1","SEM2"];
  const empSem = [
    [gan("CUA1"), gan("CUA2")],
    [gan("CUA3"), gan("CUA4")],
  ];
  ps = ps.map(p => {
    const idx = idsSem.indexOf(p.id);
    if (idx===-1) return p;
    const [local,visitante] = empSem[idx];
    if (!local||!visitante) return p;
    const {gl,gv} = simularEliminatoria(local, visitante);
    asignar(p.id, local, gl); asignar(p.id, visitante, gv);
    return {...p, id_local:local, id_visitante:visitante, goles_local:gl, goles_visitante:gv, estado:"finalizado"};
  });

  // 7. Tercer puesto
  ps = ps.map(p => {
    if (p.id!=="3ER") return p;
    const local=per("SEM1"), visitante=per("SEM2");
    if (!local||!visitante) return p;
    const {gl,gv} = simularEliminatoria(local, visitante);
    asignar(p.id, local, gl); asignar(p.id, visitante, gv);
    return {...p, id_local:local, id_visitante:visitante, goles_local:gl, goles_visitante:gv, estado:"finalizado"};
  });

  // 8. Final
  ps = ps.map(p => {
    if (p.id!=="FIN") return p;
    const local=gan("SEM1"), visitante=gan("SEM2");
    if (!local||!visitante) return p;
    const {gl,gv} = simularEliminatoria(local, visitante);
    asignar(p.id, local, gl); asignar(p.id, visitante, gv);
    return {...p, id_local:local, id_visitante:visitante, goles_local:gl, goles_visitante:gv, estado:"finalizado"};
  });

  return { partidos: ps, goleadores };
}