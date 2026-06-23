import { Request, Response } from "express";
import * as statisticsService from "../services/statisticsService";

export async function getScorersHandler(req: Request, res: Response) {
  try {
    const stats = await statisticsService.getTopScorers(req.user!.id);
    res.json(stats);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getAssistersHandler(req: Request, res: Response) {
  try {
    const stats = await statisticsService.getTopAssisters(req.user!.id);
    res.json(stats);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
