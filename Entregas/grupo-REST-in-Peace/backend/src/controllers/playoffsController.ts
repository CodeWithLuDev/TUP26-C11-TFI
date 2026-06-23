import { Request, Response } from "express";
import * as playoffsService from "../services/playoffsService";

export async function getBracketHandler(req: Request, res: Response) {
  try {
    const bracket = await playoffsService.getBracket(req.user!.id);
    res.json(bracket);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
