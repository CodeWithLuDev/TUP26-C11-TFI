import React, { createContext, useContext, useState, useEffect } from "react";
import { equipos as equiposIniciales, partidos as partidosIniciales } from "../data/data";
import { jugadores as jugadoresData } from "../data/jugadores";

const AppContext = createContext();

export function AppProvider({ children }) {

  const [equipos, setEquipos] = useState(() => {
    const guardado = localStorage.getItem("mundial_equipos");
    return guardado ? JSON.parse(guardado) : equiposIniciales;
  });

  const [partidos, setPartidos] = useState(() => {
    const guardado = localStorage.getItem("mundial_partidos");
    return guardado ? JSON.parse(guardado) : partidosIniciales;
  });


  useEffect(() => {
    localStorage.setItem("mundial_equipos", JSON.stringify(equipos));
  }, [equipos]);

  useEffect(() => {
    localStorage.setItem("mundial_partidos", JSON.stringify(partidos));
  }, [partidos]);

  function updateMatchResult(matchId, golesLocal, golesVisitante) {
    setPartidos(partidosActuales =>
      partidosActuales.map(partido => {
        if (partido.id === matchId) {
          return {
            ...partido,                          
            goles_local: Number(golesLocal),
            goles_visitante: Number(golesVisitante),
            estado: "finalizado",
          };
        }
        return partido;                          
      })
    );
  }

  function resetearDatos() {
    setEquipos(equiposIniciales);
    setPartidos(partidosIniciales);
    localStorage.removeItem("mundial_equipos");
    localStorage.removeItem("mundial_partidos");
  }

  function getJugadoresByEquipo(equipoId) {
    return jugadoresData[equipoId] || [];
  }

  return (
    <AppContext.Provider value={{
      equipos,
      partidos,
      updateMatchResult,
      resetearDatos,
      getJugadoresByEquipo,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de un AppProvider");
  }
  return context;
}