// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { equipos as equiposIniciales, partidos as partidosIniciales } from "../data/data";
import { jugadores } from "../data/jugadores";
import { simularTorneoCompleto } from "../utils/logic";

const AppContext = createContext();

export function AppProvider({ children }) {

  const [equipos, setEquipos] = useState(() => {
    const g = localStorage.getItem("mundial_equipos");
    return g ? JSON.parse(g) : equiposIniciales;
  });

  const [partidos, setPartidos] = useState(() => {
    const g = localStorage.getItem("mundial_partidos");
    return g ? JSON.parse(g) : partidosIniciales;
  });

  const [goleadores, setGoleadores] = useState(() => {
    const g = localStorage.getItem("mundial_goleadores");
    return g ? JSON.parse(g) : [];
  });

  useEffect(() => { localStorage.setItem("mundial_equipos",    JSON.stringify(equipos));    }, [equipos]);
  useEffect(() => { localStorage.setItem("mundial_partidos",   JSON.stringify(partidos));   }, [partidos]);
  useEffect(() => { localStorage.setItem("mundial_goleadores", JSON.stringify(goleadores)); }, [goleadores]);

  const BRACKET_NEXT = {
    "R32_1":  { next: "OCT1",  as: "local" },
    "R32_2":  { next: "OCT1",  as: "visitante" },
    "R32_3":  { next: "OCT2",  as: "local" },
    "R32_4":  { next: "OCT2",  as: "visitante" },
    "R32_5":  { next: "OCT3",  as: "local" },
    "R32_6":  { next: "OCT3",  as: "visitante" },
    "R32_7":  { next: "OCT4",  as: "local" },
    "R32_8":  { next: "OCT4",  as: "visitante" },
    "R32_9":  { next: "OCT5",  as: "local" },
    "R32_10": { next: "OCT5",  as: "visitante" },
    "R32_11": { next: "OCT6",  as: "local" },
    "R32_12": { next: "OCT6",  as: "visitante" },
    "R32_13": { next: "OCT7",  as: "local" },
    "R32_14": { next: "OCT7",  as: "visitante" },
    "R32_15": { next: "OCT8",  as: "local" },
    "R32_16": { next: "OCT8",  as: "visitante" },

    "OCT1": { next: "CUA1", as: "local" },
    "OCT2": { next: "CUA1", as: "visitante" },
    "OCT3": { next: "CUA2", as: "local" },
    "OCT4": { next: "CUA2", as: "visitante" },
    "OCT5": { next: "CUA3", as: "local" },
    "OCT6": { next: "CUA3", as: "visitante" },
    "OCT7": { next: "CUA4", as: "local" },
    "OCT8": { next: "CUA4", as: "visitante" },

    "CUA1": { next: "SEM1", as: "local" },
    "CUA2": { next: "SEM1", as: "visitante" },
    "CUA3": { next: "SEM2", as: "local" },
    "CUA4": { next: "SEM2", as: "visitante" },

    "SEM1": { next: "FIN", as: "local",  loses: { next: "3ER", as: "visitante" } },
    "SEM2": { next: "FIN", as: "visitante", loses: { next: "3ER", as: "local" } },
  };

  function getWinner(p) {
    if (p.goles_local === null || p.goles_visitante === null) return null;
    if (p.goles_local > p.goles_visitante) return p.id_local;
    if (p.goles_local < p.goles_visitante) return p.id_visitante;
    return null;
  }

  function getLoser(p) {
    if (p.goles_local === null || p.goles_visitante === null) return null;
    if (p.goles_local > p.goles_visitante) return p.id_visitante;
    if (p.goles_local < p.goles_visitante) return p.id_local;
    return null;
  }

  function clearDownstream(matchId, partidos) {
    let next = partidos;
    let currentId = matchId;
    while (true) {
      const rule = BRACKET_NEXT[currentId];
      if (!rule) break;

      const teamSlot = rule.as === "local" ? "id_local" : "id_visitante";
      next = next.map(p => {
        if (p.id !== rule.next) return p;
        return { ...p, [teamSlot]: null, goles_local: null, goles_visitante: null, estado: "pendiente" };
      });

      if (rule.loses) {
        const losesSlot = rule.loses.as === "local" ? "id_local" : "id_visitante";
        next = next.map(p => {
          if (p.id !== rule.loses.next) return p;
          return { ...p, [losesSlot]: null, goles_local: null, goles_visitante: null, estado: "pendiente" };
        });
      }

      currentId = rule.next;
    }
    return next;
  }

  function updateMatchResult(matchId, golesLocal, golesVisitante, nuevosGoleadores = []) {
    setPartidos(prev => {
      let next = prev.map(p => {
        if (p.id !== matchId) return p;
        return { ...p, goles_local: Number(golesLocal), goles_visitante: Number(golesVisitante), estado: "finalizado" };
      });

      const current = next.find(p => p.id === matchId);
      const rule = BRACKET_NEXT[matchId];
      if (current && rule) {
        const winner = getWinner(current);
        const teamSlot = rule.as === "local" ? "id_local" : "id_visitante";
        next = next.map(p => {
          if (p.id !== rule.next) return p;
          return { ...p, [teamSlot]: winner || null, goles_local: null, goles_visitante: null, estado: "pendiente" };
        });

        if (rule.loses) {
          const loser = getLoser(current);
          const losesSlot = rule.loses.as === "local" ? "id_local" : "id_visitante";
          next = next.map(p => {
            if (p.id !== rule.loses.next) return p;
            return { ...p, [losesSlot]: loser || null, goles_local: null, goles_visitante: null, estado: "pendiente" };
          });
        }

        next = clearDownstream(rule.next, next);
        if (rule.loses) {
          next = clearDownstream(rule.loses.next, next);
        }
      }

      return next;
    });
    setGoleadores(prev => [
      ...prev.filter(g => g.partidoId !== matchId),
      ...nuevosGoleadores.map(g => ({ ...g, partidoId: matchId }))
    ]);
  }

  // Simula todo el torneo de principio a fin
  function simularTodo() {
    const { partidos: nuevosPartidos, goleadores: nuevosGoleadores } =
      simularTorneoCompleto(equipos, partidos, jugadores);
    setPartidos(nuevosPartidos);
    setGoleadores(nuevosGoleadores);
  }

  function resetearDatos() {
    setEquipos(equiposIniciales);
    setPartidos(partidosIniciales);
    setGoleadores([]);
    localStorage.removeItem("mundial_equipos");
    localStorage.removeItem("mundial_partidos");
    localStorage.removeItem("mundial_goleadores");
  }

  return (
    <AppContext.Provider value={{ equipos, partidos, goleadores, updateMatchResult, simularTodo, resetearDatos }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext debe usarse dentro de un AppProvider");
  return context;
}