import { Request, Response } from "express";
import * as meService from "../services/meService";

export async function getFixtureHandler(req: Request, res: Response) {
  try {
    const fixture = await meService.getUserFixture(req.user!.id);
    res.json(fixture);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
