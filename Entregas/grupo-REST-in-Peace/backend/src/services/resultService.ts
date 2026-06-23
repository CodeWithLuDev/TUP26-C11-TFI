import { EventType } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export type GoalEventInput = {
  player_id: number;
  event_type: "goal" | "assist";
};

export type SubmitResultInput = {
  home_goals: number;
  away_goals: number;
  extra_time?: number;
  penalties?: number;
  penalty_winner?: string | null;
  goal_events?: GoalEventInput[];
};

export class ResultServiceError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
  }
}

export async function submitResult(
  userId: number,
  matchId: number,
  input: SubmitResultInput
) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: true,
      awayTeam: true,
      userResults: { where: { userId } },
    },
  });

  if (!match) {
    throw new ResultServiceError("Partido no encontrado", "MATCH_NOT_FOUND");
  }

  if (!match.homeTeamId || !match.awayTeamId || !match.homeTeam || !match.awayTeam) {
    throw new ResultServiceError(
      "Los equipos del partido aún no están definidos",
      "MATCH_NOT_READY"
    );
  }

  if (match.userResults.length > 0) {
    throw new ResultServiceError(
      "Este partido ya tiene un resultado cargado. Borralo antes de cargar otro.",
      "RESULT_ALREADY_EXISTS"
    );
  }

  if (input.home_goals < 0 || input.away_goals < 0) {
    throw new ResultServiceError("Los goles no pueden ser negativos", "INVALID_SCORE");
  }

  const isKnockout = match.round !== "group";
  const isDraw = input.home_goals === input.away_goals;

  if (isKnockout && isDraw && !input.penalty_winner) {
    throw new ResultServiceError(
      "En eliminación directa, un empate requiere penalty_winner (código del equipo)",
      "KNOCKOUT_DRAW_REQUIRES_PENALTIES"
    );
  }

  if (input.penalty_winner) {
    const validCodes = [match.homeTeam.code, match.awayTeam.code];
    if (!validCodes.includes(input.penalty_winner)) {
      throw new ResultServiceError(
        "penalty_winner debe ser el código del equipo local o visitante",
        "INVALID_PENALTY_WINNER"
      );
    }
  }

  const goalEvents = input.goal_events ?? [];
  const playerIds = [...new Set(goalEvents.map((e) => e.player_id))];

  const players =
    playerIds.length > 0
      ? await prisma.player.findMany({
          where: { id: { in: playerIds } },
        })
      : [];

  if (players.length !== playerIds.length) {
    throw new ResultServiceError("Uno o más jugadores no existen", "INVALID_GOAL_EVENTS");
  }

  const teamIds = new Set([match.homeTeamId, match.awayTeamId]);
  for (const player of players) {
    if (!teamIds.has(player.teamId)) {
      throw new ResultServiceError(
        "Los jugadores deben pertenecer a uno de los equipos del partido",
        "INVALID_GOAL_EVENTS"
      );
    }
  }

  const homeGoalsFromEvents = goalEvents.filter((e) => {
    if (e.event_type !== "goal") return false;
    const player = players.find((p) => p.id === e.player_id);
    return player?.teamId === match.homeTeamId;
  }).length;

  const awayGoalsFromEvents = goalEvents.filter((e) => {
    if (e.event_type !== "goal") return false;
    const player = players.find((p) => p.id === e.player_id);
    return player?.teamId === match.awayTeamId;
  }).length;

  if (homeGoalsFromEvents !== input.home_goals || awayGoalsFromEvents !== input.away_goals) {
    throw new ResultServiceError(
      "La cantidad de goles no coincide con los goal_events registrados",
      "INVALID_GOAL_EVENTS"
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const userResult = await tx.userResult.create({
      data: {
        userId,
        matchId,
        homeGoals: input.home_goals,
        awayGoals: input.away_goals,
        extraTime: input.extra_time ?? 0,
        penalties: input.penalties ?? 0,
        penaltyWinner: input.penalty_winner ?? null,
      },
    });

    if (goalEvents.length > 0) {
      await tx.userGoalEvent.createMany({
        data: goalEvents.map((e) => ({
          userId,
          matchId,
          playerId: e.player_id,
          eventType: e.event_type as EventType,
        })),
      });
    }

    const events = await tx.userGoalEvent.findMany({
      where: { userId, matchId },
      include: { player: { select: { id: true, name: true } } },
    });

    return { userResult, events };
  });

  return {
    match_id: matchId,
    home_goals: result.userResult.homeGoals,
    away_goals: result.userResult.awayGoals,
    extra_time: result.userResult.extraTime,
    penalties: result.userResult.penalties,
    penalty_winner: result.userResult.penaltyWinner,
    goal_events: result.events.map((e) => ({
      id: e.id,
      player_id: e.playerId,
      player_name: e.player.name,
      event_type: e.eventType,
    })),
  };
}

export async function deleteResult(userId: number, matchId: number) {
  const existing = await prisma.userResult.findUnique({
    where: { userId_matchId: { userId, matchId } },
  });

  if (!existing) {
    throw new ResultServiceError("No hay resultado cargado para este partido", "RESULT_NOT_FOUND");
  }

  await prisma.$transaction([
    prisma.userGoalEvent.deleteMany({ where: { userId, matchId } }),
    prisma.userResult.delete({ where: { userId_matchId: { userId, matchId } } }),
  ]);

  return { match_id: matchId, deleted: true };
}
