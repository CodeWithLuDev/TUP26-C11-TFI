import { MEX, RSA, KOR, CZE } from "./jugadores/grupoA.js";
import { CAN, BIH, QAT, SUI } from "./jugadores/grupoB.js";
import { BRA, MAR, HAI, SCO } from "./jugadores/grupoC.js";
import { USA, PAR, AUS, TUR } from "./jugadores/grupoD.js";
import { GER, CUW, CIV, ECU } from "./jugadores/grupoE.js";
import { NED, JAP, SWE, TUN } from "./jugadores/grupoF.js";
import { BEL, EGY, IRN, NZL } from "./jugadores/grupoG.js";
import { ESP, CPV, KSA, URU } from "./jugadores/grupoH.js";
import { FRA, SEN, IRQ, NOR } from "./jugadores/grupoI.js";
import { ARG, ALG, AUT, JOR } from "./jugadores/grupoJ.js";
import { POR, COD, UZB, COL } from "./jugadores/grupoK.js";
import { ENG, CRO, GHA, PAN } from "./jugadores/grupoL.js";

export const JUGADORES = {
  MEX, RSA, KOR, CZE,
  CAN, BIH, QAT, SUI,
  BRA, MAR, HAI, SCO,
  USA, PAR, AUS, TUR,
  GER, CUW, CIV, ECU,
  NED, JAP, SWE, TUN,
  BEL, EGY, IRN, NZL,
  ESP, CPV, KSA, URU,
  FRA, SEN, IRQ, NOR,
  ARG, ALG, AUT, JOR,
  POR, COD, UZB, COL,
  ENG, CRO, GHA, PAN,
};

export function getPlantelPorEquipo(equipoId) {
  return JUGADORES[equipoId] || [];
}