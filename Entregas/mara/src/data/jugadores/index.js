// src/data/jugadores/index.js
// Índice central de todos los planteles
// Importa cada grupo y los exporta en un único objeto JUGADORES
// Para agregar jugadores: editá el archivo del grupo correspondiente

import { MEX, RSA, KOR, CZE } from "./grupoA.js";
import { CAN, BIH, QAT, SUI } from "./grupoB.js";
import { BRA, MAR, HAI, SCO } from "./grupoC.js";
import { USA, PAR, AUS, TUR } from "./grupoD.js";
import { GER, CUW, CIV, ECU } from "./grupoE.js";
import { NED, JAP, SWE, TUN } from "./grupoF.js";
import { BEL, EGY, IRN, NZL } from "./grupoG.js";
import { ESP, CPV, KSA, URU } from "./grupoH.js";
import { FRA, SEN, IRQ, NOR } from "./grupoI.js";
import { ARG, ALG, AUT, JOR } from "./grupoJ.js";
import { POR, COD, UZB, COL } from "./grupoK.js";
import { ENG, CRO, GHA, PAN } from "./grupoL.js";

export const JUGADORES = {
  // GRUPO A
  MEX, RSA, KOR, CZE,
  // GRUPO B
  CAN, BIH, QAT, SUI,
  // GRUPO C
  BRA, MAR, HAI, SCO,
  // GRUPO D
  USA, PAR, AUS, TUR,
  // GRUPO E
  GER, CUW, CIV, ECU,
  // GRUPO F
  NED, JAP, SWE, TUN,
  // GRUPO G
  BEL, EGY, IRN, NZL,
  // GRUPO H
  ESP, CPV, KSA, URU,
  // GRUPO I
  FRA, SEN, IRQ, NOR,
  // GRUPO J
  ARG, ALG, AUT, JOR,
  // GRUPO K
  POR, COD, UZB, COL,
  // GRUPO L
  ENG, CRO, GHA, PAN,
};

// Helper: obtener plantel de un equipo por su ID
export function getPlantelPorEquipo(equipoId) {
  return JUGADORES[equipoId] || [];
}

// Helper: obtener jugadores de un partido (ambos equipos)
export function getJugadoresPartido(localId, visitanteId) {
  return {
    local: getPlantelPorEquipo(localId),
    visitante: getPlantelPorEquipo(visitanteId),
  };
}

// Helper: buscar jugador por nombre en cualquier equipo
export function buscarJugador(nombre) {
  const resultados = [];
  for (const [equipoId, plantel] of Object.entries(JUGADORES)) {
    const encontrado = plantel.find(j =>
      j.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    if (encontrado) resultados.push({ ...encontrado, equipoId });
  }
  return resultados;
}