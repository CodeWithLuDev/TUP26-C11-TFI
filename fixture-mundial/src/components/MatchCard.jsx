import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getEquipoById, getMatchResult } from "../utils/logic";
import { jugadores } from "../data/jugadores";
import Flag from "./Flag";

export default function MatchCard({ partido }) {
  const { equipos, goleadores, updateMatchResult } = useAppContext();

  const [golesLocal, setGolesLocal]         = useState(partido.goles_local !== null ? partido.goles_local : "");
  const [golesVisitante, setGolesVisitante] = useState(partido.goles_visitante !== null ? partido.goles_visitante : "");
  const [mostrarModal, setMostrarModal]     = useState(false);
  const [golesTemp, setGolesTemp]           = useState([]);
  const [slotBusqueda, setSlotBusqueda]     = useState([]);

  const equipoLocal     = getEquipoById(equipos, partido.id_local);
  const equipoVisitante = getEquipoById(equipos, partido.id_visitante);

  if (!equipoLocal || !equipoVisitante) {
    return (
      <div className="match pendiente">
        <p className="por-definir">Por definirse</p>
      </div>
    );
  }

  const resultado = getMatchResult(partido);
  const esFinalizado = partido.estado === "finalizado";

  const goleadoresPartido = goleadores.filter(g => g.partidoId === partido.id);
  const goleadoresLocal = goleadoresPartido.filter(g => g.equipoId === partido.id_local);
  const goleadoresVisitante = goleadoresPartido.filter(g => g.equipoId === partido.id_visitante);

  function handleGuardar() {
    if (golesLocal === "" || golesVisitante === "") {
      alert("Por favor ingresá los goles de ambos equipos.");
      return;
    }
    if (Number(golesLocal) < 0 || Number(golesVisitante) < 0) {
      alert("Los goles no pueden ser negativos.");
      return;
    }
    const total = Number(golesLocal) + Number(golesVisitante);
    if (total === 0) {
      updateMatchResult(partido.id, golesLocal, golesVisitante, []);
      return;
    }
    const slots = [];
    for (let i = 0; i < Number(golesLocal); i++) slots.push({ equipoId: partido.id_local, jugador: "" });
    for (let i = 0; i < Number(golesVisitante); i++) slots.push({ equipoId: partido.id_visitante, jugador: "" });
    setGolesTemp(slots);
    setMostrarModal(true);
  }

  function handleSlotChange(index, jugador) {
    setGolesTemp(prev => prev.map((g, i) => i === index ? { ...g, jugador } : g));
  }

  function handleConfirmarGoleadores() {
    const mapa = {};
    golesTemp.forEach(({ equipoId, jugador }) => {
      if (!jugador) return;
      const key = `${equipoId}__${jugador}`;
      if (!mapa[key]) mapa[key] = { equipoId, jugador, cantidad: 0 };
      mapa[key].cantidad += 1;
    });
    updateMatchResult(partido.id, golesLocal, golesVisitante, Object.values(mapa));
    setMostrarModal(false);
  }

  function handleOmitir() {
    updateMatchResult(partido.id, golesLocal, golesVisitante, []);
    setMostrarModal(false);
  }

  return (
    <>
      <div className={`match ${esFinalizado ? "match--finalizado" : "match--pendiente"}`}>
        {/* Fecha / Grupo */}
        <div className="match-header">
          <span>Fecha {Math.ceil(parseInt(partido.id.slice(-1), 10) / 2)} — Grupo {partido.grupo}</span>
        </div>

        {/* Scoreboard */}
        <div className="match-scoreboard">
          <div className="match-team match-team--home">
            <span className="match-team-name">{equipoLocal.nombre}</span>
            <Flag equipoId={partido.id_local} size="w40" className="match-team-flag" />
          </div>

          <div className={`match-score ${!esFinalizado ? "match-score--pending" : ""}`}>
            {esFinalizado ? (
              <>
                <span className="match-score-value">{partido.goles_local}</span>
                <span className="match-score-divider">–</span>
                <span className="match-score-value">{partido.goles_visitante}</span>
              </>
            ) : (
              <div className="match-score-inputs">
                <input type="number" min="0" max="99" value={golesLocal}
                  onChange={e => setGolesLocal(e.target.value)} className="match-input" />
                <span className="match-score-divider">–</span>
                <input type="number" min="0" max="99" value={golesVisitante}
                  onChange={e => setGolesVisitante(e.target.value)} className="match-input" />
              </div>
            )}
          </div>

          <div className="match-team match-team--away">
            <Flag equipoId={partido.id_visitante} size="w40" className="match-team-flag" />
            <span className="match-team-name">{equipoVisitante.nombre}</span>
          </div>
        </div>

        {/* Scorers row */}
        {esFinalizado && (goleadoresLocal.length > 0 || goleadoresVisitante.length > 0) && (
          <div className="match-scorers">
            <div className="match-scorers-half">
              {goleadoresLocal.map(g => (
                <span key={g.jugador} className="match-scorer">
                  <span className="match-scorer-name">{g.jugador}</span>
                  {g.cantidad > 1 && <span className="match-scorer-note"> ({g.cantidad})</span>}
                </span>
              ))}
            </div>
            <div className="match-scorers-half match-scorers-half--away">
              {goleadoresVisitante.map(g => (
                <span key={g.jugador} className="match-scorer">
                  <span className="match-scorer-name">{g.jugador}</span>
                  {g.cantidad > 1 && <span className="match-scorer-note"> ({g.cantidad})</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Status badge */}
        {esFinalizado && (
          <div className="match-status">
            {resultado === "empate" ? "Empate" :
             resultado === "local"  ? `Ganó ${equipoLocal.nombre}` :
                                       `Ganó ${equipoVisitante.nombre}`}
          </div>
        )}

        {/* Button for pending matches */}
        {!esFinalizado && (
          <div className="match-acciones">
            <button className="match-btn-guardar" onClick={handleGuardar}>
              Guardar resultado
            </button>
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚽ Goleadores</h3>
            <p className="modal-subtitulo">
              <Flag equipoId={partido.id_local} size="w20" className="bandera-inline" /> {equipoLocal.nombre} {golesLocal} - {golesVisitante} {equipoVisitante.nombre} <Flag equipoId={partido.id_visitante} size="w20" className="bandera-inline" />
            </p>

            <div className="modal-slots">
              {golesTemp.map((slot, index) => {
                const esLocal  = slot.equipoId === partido.id_local;
                const plantel  = jugadores[slot.equipoId] || [];
                const opciones = plantel.filter(j => j.posicion !== "AR");
                const busq     = (slotBusqueda[index] || "").toLowerCase();
                const filtradas = busq ? opciones.filter(j => j.nombre.toLowerCase().includes(busq)) : opciones;

                return (
                  <div key={index} className={`slot-gol ${esLocal ? "slot-local" : "slot-visitante"}`}>
                    <span className="slot-equipo"><Flag equipoId={slot.equipoId} size="w20" className="bandera-inline" /> Gol {esLocal ? "local" : "visitante"} {index + 1}</span>

                    <input
                      type="text"
                      className="slot-busqueda"
                      placeholder="Buscar jugador…"
                      value={slotBusqueda[index] || ""}
                      onChange={e => {
                        const nuevo = [...slotBusqueda];
                        nuevo[index] = e.target.value;
                        setSlotBusqueda(nuevo);
                      }}
                    />

                    <div className="slot-lista">
                      {filtradas.length === 0 ? (
                        <div className="slot-sin-resultados">Sin resultados</div>
                      ) : (
                        filtradas.map(j => (
                          <button
                            key={j.nombre}
                            className={`slot-opcion ${slot.jugador === j.nombre ? "seleccionada" : ""}`}
                            onClick={() => {
                              handleSlotChange(index, j.nombre);
                              const nuevo = [...slotBusqueda];
                              nuevo[index] = j.nombre;
                              setSlotBusqueda(nuevo);
                            }}
                          >
                            {j.nombre}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="modal-botones">
              <button className="btn-confirmar" onClick={handleConfirmarGoleadores}>Confirmar goleadores</button>
              <button className="btn-omitir" onClick={handleOmitir}>Omitir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
