
import React, { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { calculateGroupStandings } from "../utils/logic";

function SquadList({ equipoId }) {
  const { getJugadoresByEquipo } = useAppContext();
  const [abierto, setAbierto] = useState(false);
  const jugadores = getJugadoresByEquipo(equipoId);

  const posicionLabel = {
    AR: "Arqueros",
    DEF: "Defensores",
    MED: "Mediocampistas",
    DEL: "Delanteros",
  };

  const agrupados = { AR: [], DEF: [], MED: [], DEL: [] };
  jugadores.forEach(j => {
    if (agrupados[j.posicion]) agrupados[j.posicion].push(j.nombre);
  });

  return (
    <div className="squad-container">
      <button className="btn-squad" onClick={() => setAbierto(!abierto)}>
        {abierto ? "Ocultar plantilla" : "Ver plantilla"} ({jugadores.length})
      </button>
      {abierto && (
        <div className="squad-list">
          {Object.entries(agrupados).map(([pos, nombres]) =>
            nombres.length > 0 && (
              <div key={pos} className="squad-posicion">
                <strong>{posicionLabel[pos]}:</strong> {nombres.join(" | ")}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function GroupTable({ grupo }) {
  const { equipos, partidos } = useAppContext();

  
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
                <td className="col-equipo">
                  <span className="bandera">{equipo.bandera}</span>
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
              <tr>
                <td colSpan="10" style={{ padding: 0, border: "none" }}>
                  <SquadList equipoId={equipo.id} />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}