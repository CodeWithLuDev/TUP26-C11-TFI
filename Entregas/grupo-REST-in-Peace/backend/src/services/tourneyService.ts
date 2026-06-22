import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export function getTeams() {
  return prisma.team.findMany({ orderBy: { id: "asc" } });
}

export function getMatches() {
  return prisma.match.findMany({ orderBy: { scheduledAtUtc: "asc" } });
}

export function getPlayers(teamId: number) {
  return prisma.player.findMany({
    where: { teamId },
    orderBy: { number: "asc" },
  });
}
