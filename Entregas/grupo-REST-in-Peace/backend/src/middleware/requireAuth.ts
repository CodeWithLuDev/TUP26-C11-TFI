import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      username: string;
    };
    req.user = { id: payload.id, username: payload.username };
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
