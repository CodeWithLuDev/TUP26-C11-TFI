
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getEquipoById, getMatchResult } from "../utils/logic";


export default function MatchCard({ partido }) {
  const { equipos, updateMatchResult } = useAppContext();

  // Estado local para los inputs (solo vive dentro de esta tarjeta)
  const [golesLocal, setGolesLocal]           = useState(
    partido.goles_local !== null ? partido.goles_local : ""
  );
  const [golesVisitante, setGolesVisitante]   = useState(
    partido.goles_visitante !== null ? partido.goles_visitante : ""
  );

  const equipoLocal      = getEquipoById(equipos, partido.id_local);
  const equipoVisitante  = getEquipoById(equipos, partido.id_visitante);

  if (!equipoLocal || !equipoVisitante) {
    return (
      <div className="match-card pendiente">
        <p className="por-definir">Por definirse</p>
      </div>
    );
  }

  const resultado = getMatchResult(partido);

  function handleGuardar() {
    // Validar que ambos campos tengan valores numéricos válidos
    if (golesLocal === "" || golesVisitante === "") {
      alert("Por favor ingresá los goles de ambos equipos.");
      return;
    }
    if (Number(golesLocal) < 0 || Number(golesVisitante) < 0) {
      alert("Los goles no pueden ser negativos.");
      return;
    }
    updateMatchResult(partido.id, golesLocal, golesVisitante);
  }

  const fechaFormateada = new Date(partido.fecha).toLocaleDateString("es-AR", {
    day:   "2-digit",
    month: "short",
    hour:  "2-digit",
    minute:"2-digit",
  });

  return (
    <div className={`match-card ${partido.estado}`}>

      <p className="match-fecha">{fechaFormateada}</p>

      <div className="match-equipos">

        {/* Equipo Local */}
        <div className={`equipo ${resultado === "local" ? "ganador" : ""}`}>
          <span className="bandera">{equipoLocal.bandera}</span>
          <span className="nombre">{equipoLocal.nombre}</span>
        </div>

        {/* Inputs de goles */}
        <div className="marcador">
          <input
            type="number"
            min="0"
            max="99"
            value={golesLocal}
            onChange={e => setGolesLocal(e.target.value)}
            className="input-goles"
          />
          <span className="separador">-</span>
          <input
            type="number"
            min="0"
            max="99"
            value={golesVisitante}
            onChange={e => setGolesVisitante(e.target.value)}
            className="input-goles"
          />
        </div>

        {/* Equipo Visitante */}
        <div className={`equipo visitante ${resultado === "visitante" ? "ganador" : ""}`}>
          <span className="bandera">{equipoVisitante.bandera}</span>
          <span className="nombre">{equipoVisitante.nombre}</span>
        </div>

      </div>

      <button className="btn-guardar" onClick={handleGuardar}>
        Guardar resultado
      </button>

      {partido.estado === "finalizado" && (
        <p className="estado-badge">
          {resultado === "empate" ? "Empate" :
           resultado === "local"  ? `Ganó ${equipoLocal.nombre}` :
                                    `Ganó ${equipoVisitante.nombre}`}
        </p>
      )}

    </div>
  );
}