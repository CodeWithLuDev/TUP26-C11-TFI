// src/components/GroupTable.jsx
import React, { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { calculateGroupStandings } from "../utils/logic";
import { jugadores } from "../data/jugadores";
import Flag from "./Flag";

const posicionLabel = {
  AR: "Arqueros",
  DEF: "Defensores",
  MED: "Mediocampistas",
  DEL: "Delanteros",
};

function SquadContent({ equipoId }) {
  const plantel = jugadores[equipoId] || [];
  const agrupados = { AR: [], DEF: [], MED: [], DEL: [] };
  plantel.forEach(j => {
    if (agrupados[j.posicion]) agrupados[j.posicion].push(j.nombre);
  });

  return (
    <div className="squad-list">
      {Object.entries(agrupados).map(([pos, nombres]) =>
        nombres.length > 0 && (
          <div key={pos} className="squad-posicion">
            <strong>{posicionLabel[pos]}:</strong> {nombres.join(" | ")}
          </div>
        )
      )}
    </div>
  );
}

export default function GroupTable({ grupo }) {
  const { equipos, partidos } = useAppContext();
  const [abiertos, setAbiertos] = useState(new Set());

  const toggle = (id) => {
    setAbiertos(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tabla = useMemo(
    () => calculateGroupStandings(equipos, partidos, grupo),
    [equipos, partidos, grupo]
  );

  return (
    <div className="group-table">
      <h2 className="group-title">Grupo {grupo}</h2>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th className="col-equipo">Equipo</th>
            <th title="Partidos Jugados">PJ</th>
            <th title="Ganados">G</th>
            <th title="Empatados">E</th>
            <th title="Perdidos">P</th>
            <th title="Goles a Favor">GF</th>
            <th title="Goles en Contra">GC</th>
            <th title="Diferencia de Gol">DG</th>
            <th title="Puntos">PTS</th>
          </tr>
        </thead>
        <tbody>
          {tabla.map((equipo, index) => (
            <React.Fragment key={equipo.id}>
              <tr className={index < 2 ? "clasificado" : ""}>
                <td>{index + 1}</td>
                <td className="col-equipo equipo-clickeable" onClick={() => toggle(equipo.id)}>
                  <Flag equipoId={equipo.id} size="w40" className="bandera-img" />
                  {equipo.nombre}
                </td>
                <td>{equipo.PJ}</td>
                <td>{equipo.PG}</td>
                <td>{equipo.PE}</td>
                <td>{equipo.PP}</td>
                <td>{equipo.GF}</td>
                <td>{equipo.GC}</td>
                <td className={equipo.DG > 0 ? "positivo" : equipo.DG < 0 ? "negativo" : ""}>
                  {equipo.DG > 0 ? `+${equipo.DG}` : equipo.DG}
                </td>
                <td className="puntos">{equipo.PTS}</td>
              </tr>
              {abiertos.has(equipo.id) && (
                <tr>
                  <td colSpan="10" style={{ padding: 0, border: "none" }}>
                    <SquadContent equipoId={equipo.id} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}