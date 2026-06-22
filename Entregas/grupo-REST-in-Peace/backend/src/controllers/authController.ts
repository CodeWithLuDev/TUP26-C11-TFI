import { Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import * as authService from "../services/authService";

export async function registerHandler(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "username y password son requeridos" });
    return;
  }

  try {
    const result = await authService.register(username, password);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      res.status(409).json({ error: "El username ya está registrado" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function loginHandler(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "username y password son requeridos" });
    return;
  }

  try {
    const result = await authService.login(username, password);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
