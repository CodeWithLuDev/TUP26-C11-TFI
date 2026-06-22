import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function generateToken(payload: { id: number; username: string }): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export async function register(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash },
    select: { id: true, username: true },
  });
  const token = generateToken(user);
  return { token, user };
}

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  const token = generateToken({ id: user.id, username: user.username });
  return { token, user: { id: user.id, username: user.username } };
}
