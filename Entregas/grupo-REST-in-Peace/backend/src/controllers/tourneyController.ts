import { Request, Response } from "express";
import * as tourneyService from "../services/tourneyService";

export async function getTeamsHandler(_req: Request, res: Response) {
  const teams = await tourneyService.getTeams();
  res.json(
    teams.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      flag_emoji: t.flagEmoji,
      group_letter: t.groupLetter,
    }))
  );
}

export async function getMatchesHandler(_req: Request, res: Response) {
  const matches = await tourneyService.getMatches();
  res.json(
    matches.map((m) => ({
      id: m.id,
      round: m.round,
      group_letter: m.groupLetter,
      slot_key: m.slotKey,
      home_team_id: m.homeTeamId,
      away_team_id: m.awayTeamId,
      home_source: m.homeSource,
      away_source: m.awaySource,
      scheduled_at_utc: m.scheduledAtUtc,
      stadium: m.stadium,
    }))
  );
}

export async function getPlayersHandler(req: Request, res: Response) {
  const { teamId } = req.query;
  if (!teamId) {
    res.status(400).json({ error: "teamId es requerido" });
    return;
  }

  const id = Number(teamId);
  if (isNaN(id)) {
    res.status(400).json({ error: "teamId debe ser un número" });
    return;
  }

  const players = await tourneyService.getPlayers(id);
  res.json(
    players.map((p) => ({
      id: p.id,
      name: p.name,
      number: p.number,
      team_id: p.teamId,
    }))
  );
}
