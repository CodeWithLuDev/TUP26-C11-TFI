import { EventType } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { buildKnockoutResolutions, toTeamShapeNullable } from "./playoffsCore";
import { getGroupQualifiers, type TeamShape } from "./standingsService";

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

type MatchTeamForResolution = {
  id: number;
  name: string;
  code: string;
  flagEmoji: string;
} | null;

type MatchForTeamResolution = {
  id: number;
  round: string;
  homeTeam: MatchTeamForResolution;
  awayTeam: MatchTeamForResolution;
};

type MatchDependency = {
  id: number;
  slotKey: string | null;
  groupLetter: string | null;
  homeSource: string | null;
  awaySource: string | null;
};

async function resolveMatchTeams(
  userId: number,
  match: MatchForTeamResolution
): Promise<{ homeTeam: TeamShape | null; awayTeam: TeamShape | null }> {
  if (match.round === "group") {
    return {
      homeTeam: toTeamShapeNullable(match.homeTeam),
      awayTeam: toTeamShapeNullable(match.awayTeam),
    };
  }

  const [groupResults, knockoutMatches] = await Promise.all([
    getGroupQualifiers(userId),
    prisma.match.findMany({
      where: { round: { not: "group" } },
      include: {
        homeTeam: true,
        awayTeam: true,
        userResults: { where: { userId } },
      },
    }),
  ]);

  return (
    buildKnockoutResolutions(knockoutMatches, groupResults).get(match.id) ?? {
      homeTeam: null,
      awayTeam: null,
    }
  );
}

function sourceReferencesGroup(source: string | null, groupLetter: string) {
  return source === `Winner Group ${groupLetter}` || source === `Runner-up Group ${groupLetter}`;
}

function sourceReferencesSlot(source: string | null, slotKey: string) {
  return source === `Winner ${slotKey}` || source === `Loser ${slotKey}`;
}

function collectDownstreamMatchIds(
  deletedMatch: MatchDependency & { round: string },
  knockoutMatches: MatchDependency[]
) {
  const downstreamMatchIds = new Set<number>();
  const affectedGroups = new Set<string>();
  const affectedSlots = new Set<string>();

  if (deletedMatch.round === "group" && deletedMatch.groupLetter) {
    affectedGroups.add(deletedMatch.groupLetter);
  } else if (deletedMatch.slotKey) {
    affectedSlots.add(deletedMatch.slotKey);
  }

  let foundNewDependency = true;
  while (foundNewDependency) {
    foundNewDependency = false;

    for (const match of knockoutMatches) {
      if (match.id === deletedMatch.id || downstreamMatchIds.has(match.id)) continue;

      const sources = [match.homeSource, match.awaySource];
      const dependsOnGroup = [...affectedGroups].some((groupLetter) =>
        sources.some((source) => sourceReferencesGroup(source, groupLetter))
      );
      const dependsOnSlot = [...affectedSlots].some((slotKey) =>
        sources.some((source) => sourceReferencesSlot(source, slotKey))
      );

      if (!dependsOnGroup && !dependsOnSlot) continue;

      downstreamMatchIds.add(match.id);
      if (match.slotKey) affectedSlots.add(match.slotKey);
      foundNewDependency = true;
    }
  }

  return [...downstreamMatchIds];
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

  const { homeTeam, awayTeam } = await resolveMatchTeams(userId, match);

  if (!homeTeam || !awayTeam) {
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
    const validCodes = [homeTeam.code, awayTeam.code];
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

  const teamIds = new Set([homeTeam.id, awayTeam.id]);
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
    return player?.teamId === homeTeam.id;
  }).length;

  const awayGoalsFromEvents = goalEvents.filter((e) => {
    if (e.event_type !== "goal") return false;
    const player = players.find((p) => p.id === e.player_id);
    return player?.teamId === awayTeam.id;
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
    include: {
      match: {
        select: {
          id: true,
          round: true,
          slotKey: true,
          groupLetter: true,
          homeSource: true,
          awaySource: true,
        },
      },
    },
  });

  if (!existing) {
    throw new ResultServiceError("No hay resultado cargado para este partido", "RESULT_NOT_FOUND");
  }

  const knockoutMatches = await prisma.match.findMany({
    where: { round: { not: "group" } },
    select: {
      id: true,
      slotKey: true,
      groupLetter: true,
      homeSource: true,
      awaySource: true,
    },
  });
  const downstreamMatchIds = collectDownstreamMatchIds(existing.match, knockoutMatches);
  const resultMatchIds = [matchId, ...downstreamMatchIds];
  const downstreamResults = await prisma.userResult.findMany({
    where: {
      userId,
      matchId: { in: downstreamMatchIds },
    },
    select: { matchId: true },
  });

  await prisma.$transaction([
    prisma.userGoalEvent.deleteMany({ where: { userId, matchId: { in: resultMatchIds } } }),
    prisma.userResult.deleteMany({ where: { userId, matchId: { in: resultMatchIds } } }),
  ]);

  return {
    match_id: matchId,
    deleted: true,
    cascade_deleted_match_ids: downstreamResults.map((result) => result.matchId),
  };
}
