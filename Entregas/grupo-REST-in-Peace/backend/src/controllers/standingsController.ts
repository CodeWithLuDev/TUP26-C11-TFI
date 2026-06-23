import { Request, Response } from "express";
import * as standingsService from "../services/standingsService";

export async function getStandingsHandler(req: Request, res: Response) {
  try {
    const raw = req.params.groupLetter;
    const groupLetter = typeof raw === "string" ? raw.toUpperCase() : undefined;
    const standings = await standingsService.getStandings(req.user!.id, groupLetter);

    if (standings === null) {
      res.status(400).json({ error: "Grupo inválido. Usá una letra de A a H." });
      return;
    }

    res.json(standings);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAllStandingsHandler(req: Request, res: Response) {
  try {
    const standings = await standingsService.getStandings(req.user!.id);
    res.json(standings);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
