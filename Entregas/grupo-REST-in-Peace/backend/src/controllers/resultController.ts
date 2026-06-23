import { Request, Response } from "express";
import * as resultService from "../services/resultService";
import { ResultServiceError } from "../services/resultService";

const ERROR_STATUS: Record<string, number> = {
  MATCH_NOT_FOUND: 404,
  MATCH_NOT_READY: 400,
  RESULT_ALREADY_EXISTS: 409,
  RESULT_NOT_FOUND: 404,
  INVALID_SCORE: 400,
  INVALID_GOAL_EVENTS: 400,
  INVALID_PENALTY_WINNER: 400,
  KNOCKOUT_DRAW_REQUIRES_PENALTIES: 400,
};

export async function submitResultHandler(req: Request, res: Response) {
  const matchId = Number(req.params.matchId);
  if (isNaN(matchId)) {
    res.status(400).json({ error: "matchId debe ser un número" });
    return;
  }

  const { home_goals, away_goals, extra_time, penalties, penalty_winner, goal_events } =
    req.body;

  if (home_goals === undefined || away_goals === undefined) {
    res.status(400).json({ error: "home_goals y away_goals son requeridos" });
    return;
  }

  try {
    const result = await resultService.submitResult(req.user!.id, matchId, {
      home_goals,
      away_goals,
      extra_time,
      penalties,
      penalty_winner,
      goal_events,
    });
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof ResultServiceError) {
      res.status(ERROR_STATUS[err.code] ?? 400).json({ error: err.message, code: err.code });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function deleteResultHandler(req: Request, res: Response) {
  const matchId = Number(req.params.matchId);
  if (isNaN(matchId)) {
    res.status(400).json({ error: "matchId debe ser un número" });
    return;
  }

  try {
    const result = await resultService.deleteResult(req.user!.id, matchId);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof ResultServiceError) {
      res.status(ERROR_STATUS[err.code] ?? 400).json({ error: err.message, code: err.code });
      return;
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
