import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getEquipoById, getMatchResult } from "../utils/logic";
import { jugadores } from "../data/jugadores";
import Flag from "./Flag";

const RONDAS_IZQ = [
  { fase: "16avos",  titulo: "16avos",  ids: ["R32_1","R32_2","R32_3","R32_4","R32_5","R32_6","R32_7","R32_8"] },
  { fase: "Octavos", titulo: "Octavos", ids: ["OCT1","OCT2","OCT3","OCT4"] },
  { fase: "Cuartos", titulo: "Cuartos", ids: ["CUA1","CUA2"] },
];

const RONDAS_DER = [
  { fase: "16avos",  titulo: "16avos",  ids: ["R32_9","R32_10","R32_11","R32_12","R32_13","R32_14","R32_15","R32_16"] },
  { fase: "Octavos", titulo: "Octavos", ids: ["OCT5","OCT6","OCT7","OCT8"] },
  { fase: "Cuartos", titulo: "Cuartos", ids: ["CUA3","CUA4"] },
];

const BASE_UNIT = 2;
const TOTAL_ROWS = 8 * BASE_UNIT;

function MatchNode({ partido, equipos }) {
  const { updateMatchResult } = useAppContext();
  const [golesLocal, setGolesLocal]         = useState(partido?.goles_local ?? "");
  const [golesVisitante, setGolesVisitante] = useState(partido?.goles_visitante ?? "");

  if (!partido) return <div className="bracket-node vacio" />;

  const equipoLocal     = getEquipoById(equipos, partido.id_local);
  const equipoVisitante = getEquipoById(equipos, partido.id_visitante);
  const resultado       = getMatchResult(partido);

  if (!equipoLocal || !equipoVisitante) {
    return (
      <div className="bracket-node por-definir">
        <p className="bracket-tbd">{partido.id} — por definir</p>
      </div>
    );
  }

  function handleBlur() {
    if (golesLocal === "" || golesVisitante === "") return;
    if (Number(golesLocal) === (partido.goles_local ?? -1) &&
        Number(golesVisitante) === (partido.goles_visitante ?? -1)) return;

    const plantelLocal     = (jugadores[partido.id_local]     || []).filter(j => j.posicion !== "AR");
    const plantelVisitante = (jugadores[partido.id_visitante] || []).filter(j => j.posicion !== "AR");
    const goleadores = [];
    function asignar(plantel, equipoId, cantidad) {
      for (let i = 0; i < cantidad; i++) {
        if (!plantel.length) continue;
        const j = plantel[Math.floor(Math.random() * plantel.length)].nombre;
        const idx = goleadores.findIndex(g => g.equipoId === equipoId && g.jugador === j);
        if (idx >= 0) goleadores[idx].cantidad += 1;
        else goleadores.push({ equipoId, jugador: j, cantidad: 1 });
      }
    }
    asignar(plantelLocal,     partido.id_local,     Number(golesLocal));
    asignar(plantelVisitante, partido.id_visitante, Number(golesVisitante));
    updateMatchResult(partido.id, golesLocal, golesVisitante, goleadores);
  }

  return (
    <div className="bracket-node">
      <div className={`bracket-equipo ${resultado === "local" ? "bracket-ganador" : ""}`}>
        <Flag equipoId={partido.id_local} size="w20" className="bandera-img" />
        <span className="bracket-nombre">{equipoLocal.nombre}</span>
        <input type="number" min="0" max="20" className="bracket-input"
          value={golesLocal} onChange={e => setGolesLocal(e.target.value)} onBlur={handleBlur} />
      </div>
      <div className={`bracket-equipo ${resultado === "visitante" ? "bracket-ganador" : ""}`}>
        <Flag equipoId={partido.id_visitante} size="w20" className="bandera-img" />
        <span className="bracket-nombre">{equipoVisitante.nombre}</span>
        <input type="number" min="0" max="20" className="bracket-input"
          value={golesVisitante} onChange={e => setGolesVisitante(e.target.value)} onBlur={handleBlur} />
      </div>
    </div>
  );
}

function BracketHalf({ rondas, equipos, partidos, invertido, extraConnAfter, extraConnBefore }) {
  const getPartido = id => partidos.find(p => p.id === id) || null;
  const rondasOrdenadas = invertido ? [...rondas].reverse() : rondas;

  const columns = [];
  if (extraConnBefore) {
    columns.push({ type: "conn", unit: extraConnBefore.unit, count: extraConnBefore.count });
  }
  rondasOrdenadas.forEach((ronda, r) => {
    const unit = BASE_UNIT * (TOTAL_ROWS / (ronda.ids.length * BASE_UNIT));
    columns.push({ type: "ronda", ronda, unit });
    if (r < rondasOrdenadas.length - 1) {
      const nextRonda = rondasOrdenadas[r + 1];
      const outerRonda = ronda.ids.length >= nextRonda.ids.length ? ronda : nextRonda;
      const outerUnit = BASE_UNIT * (TOTAL_ROWS / (outerRonda.ids.length * BASE_UNIT));
      columns.push({ type: "conn", unit: outerUnit, count: outerRonda.ids.length });
    }
  });
  if (extraConnAfter) {
    columns.push({ type: "conn", unit: extraConnAfter.unit, count: extraConnAfter.count });
  }

  return (
    <div className={`bracket-mitad ${invertido ? "bracket-mitad-der" : "bracket-mitad-izq"}`}>
      {columns.map((col, colIdx) => {
        if (col.type === "ronda") {
          const { ronda, unit } = col;
          const isFirstRonda = colIdx === 0;
          const isLastRonda = colIdx === columns.length - 1;
          return (
            <div key={ronda.fase} className="bracket-columna-grid">
              <h3 className="bracket-titulo-grid">{ronda.titulo}</h3>
              <div className="bracket-columna-inner" style={{ display: "grid", gridTemplateRows: `repeat(${TOTAL_ROWS}, 1fr)`, gap: "8px", height: "100%" }}>
                  {ronda.ids.map((id, i) => {
                    let cls = "bracket-celda";
                    if (!isFirstRonda) cls += " conn-before";
                    if (!isLastRonda) cls += " conn-after";
                    return (
                    <div key={id} className={cls} style={{ gridRow: `${i * unit + 1} / span ${unit}` }}>
                      <MatchNode partido={getPartido(id)} equipos={equipos} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        } else {
          const unit = col.unit;
          const count = col.count;
          const pairs = count / 2;
          return (
            <div key={`conn-${colIdx}`} className="bracket-connector-col">
              <div className="bracket-conn-spacer" />
              <div className="bracket-conn-grid" style={{ display: "grid", gridTemplateRows: `repeat(${TOTAL_ROWS}, 1fr)`, gap: "8px", flex: 1 }}>
                {Array.from({ length: pairs }, (_, p) => {
                  const topRow = p * unit * 2 + 1;
                  const spanRows = unit * 2;
                  return (
                    <div key={p} className="bracket-conn-pair" style={{ gridRow: `${topRow} / span ${spanRows}` }} />
                  );
                })}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

function FinalsSection({ getPartido, final, partido3er, equipos }) {
  return (
    <div className="bracket-finals">
      {/* SEM1 */}
      <div className="bracket-finals-item">
        <h3 className="bracket-finals-title">Semifinal</h3>
        <div className="bracket-finals-matchwrap">
          <MatchNode partido={getPartido("SEM1")} equipos={equipos} />
        </div>
      </div>

      {/* Connector SEM1 → Final */}
      <div className="bracket-finals-conn">
        <div className="bracket-conn-spacer" />
        <div className="bracket-finals-conn-body conn-left" />
      </div>

      {/* Centro: Final + 3er */}
      <div className="bracket-finals-center">
        <h3 className="bracket-finals-title">Final</h3>
        <div className="bracket-finals-center-body">
          <div className="bracket-finals-finalwrap">
            <MatchNode partido={final} equipos={equipos} />
          </div>
          <div className="bracket-finals-bottom">
            <div className="bracket-finals-3ersep" />
            <h3 className="bracket-finals-title">3er puesto</h3>
            <MatchNode partido={partido3er} equipos={equipos} />
          </div>
        </div>
      </div>

      {/* Connector Final → SEM2 */}
      <div className="bracket-finals-conn">
        <div className="bracket-conn-spacer" />
        <div className="bracket-finals-conn-body conn-right" />
      </div>

      {/* SEM2 */}
      <div className="bracket-finals-item">
        <h3 className="bracket-finals-title">Semifinal</h3>
        <div className="bracket-finals-matchwrap">
          <MatchNode partido={getPartido("SEM2")} equipos={equipos} />
        </div>
      </div>
    </div>
  );
}

export default function Bracket() {
  const { equipos, partidos } = useAppContext();
  const getPartido = id => partidos.find(p => p.id === id) || null;
  const final     = getPartido("FIN");
  const partido3er = getPartido("3ER");

  let champion = null;
  if (final && final.goles_local !== null && final.goles_visitante !== null) {
    const winnerId = final.goles_local > final.goles_visitante ? final.id_local : final.id_visitante;
    champion = getEquipoById(equipos, winnerId);
  }

  return (
    <div className="bracket-wrapper">
      {champion && (
        <div className="champion-banner">
          <span className="champion-trophy">🏆</span>
          <Flag equipoId={champion.id} size="w80" className="champion-flag" />
          <span className="champion-label">CAMPEÓN</span>
          <span className="champion-name">{champion.nombre}</span>
        </div>
      )}
      <div className="bracket-completo">
        <BracketHalf rondas={RONDAS_IZQ} equipos={equipos} partidos={partidos} invertido={false} extraConnAfter={{ unit: 8, count: 2 }} />
        <FinalsSection getPartido={getPartido} final={final} partido3er={partido3er} equipos={equipos} />
        <BracketHalf rondas={RONDAS_DER} equipos={equipos} partidos={partidos} invertido={true} extraConnBefore={{ unit: 8, count: 2 }} />
      </div>
    </div>
  );
}
