import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─── Teams ────────────────────────────────────────────────────────────────────

const teams = [
  // Grupo A
  { name: "Qatar",         code: "QAT", flagEmoji: "🇶🇦", groupLetter: "A" },
  { name: "Ecuador",       code: "ECU", flagEmoji: "🇪🇨", groupLetter: "A" },
  { name: "Senegal",       code: "SEN", flagEmoji: "🇸🇳", groupLetter: "A" },
  { name: "Países Bajos",  code: "NED", flagEmoji: "🇳🇱", groupLetter: "A" },
  // Grupo B
  { name: "Inglaterra",    code: "ENG", flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", groupLetter: "B" },
  { name: "Irán",          code: "IRN", flagEmoji: "🇮🇷", groupLetter: "B" },
  { name: "Estados Unidos",code: "USA", flagEmoji: "🇺🇸", groupLetter: "B" },
  { name: "Gales",         code: "WAL", flagEmoji: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", groupLetter: "B" },
  // Grupo C
  { name: "Argentina",     code: "ARG", flagEmoji: "🇦🇷", groupLetter: "C" },
  { name: "Arabia Saudita",code: "KSA", flagEmoji: "🇸🇦", groupLetter: "C" },
  { name: "México",        code: "MEX", flagEmoji: "🇲🇽", groupLetter: "C" },
  { name: "Polonia",       code: "POL", flagEmoji: "🇵🇱", groupLetter: "C" },
  // Grupo D
  { name: "Francia",       code: "FRA", flagEmoji: "🇫🇷", groupLetter: "D" },
  { name: "Australia",     code: "AUS", flagEmoji: "🇦🇺", groupLetter: "D" },
  { name: "Dinamarca",     code: "DEN", flagEmoji: "🇩🇰", groupLetter: "D" },
  { name: "Túnez",         code: "TUN", flagEmoji: "🇹🇳", groupLetter: "D" },
  // Grupo E
  { name: "España",        code: "ESP", flagEmoji: "🇪🇸", groupLetter: "E" },
  { name: "Costa Rica",    code: "CRC", flagEmoji: "🇨🇷", groupLetter: "E" },
  { name: "Alemania",      code: "GER", flagEmoji: "🇩🇪", groupLetter: "E" },
  { name: "Japón",         code: "JPN", flagEmoji: "🇯🇵", groupLetter: "E" },
  // Grupo F
  { name: "Bélgica",       code: "BEL", flagEmoji: "🇧🇪", groupLetter: "F" },
  { name: "Canadá",        code: "CAN", flagEmoji: "🇨🇦", groupLetter: "F" },
  { name: "Marruecos",     code: "MAR", flagEmoji: "🇲🇦", groupLetter: "F" },
  { name: "Croacia",       code: "CRO", flagEmoji: "🇭🇷", groupLetter: "F" },
  // Grupo G
  { name: "Brasil",        code: "BRA", flagEmoji: "🇧🇷", groupLetter: "G" },
  { name: "Serbia",        code: "SRB", flagEmoji: "🇷🇸", groupLetter: "G" },
  { name: "Suiza",         code: "SUI", flagEmoji: "🇨🇭", groupLetter: "G" },
  { name: "Camerún",       code: "CMR", flagEmoji: "🇨🇲", groupLetter: "G" },
  // Grupo H
  { name: "Portugal",      code: "POR", flagEmoji: "🇵🇹", groupLetter: "H" },
  { name: "Ghana",         code: "GHA", flagEmoji: "🇬🇭", groupLetter: "H" },
  { name: "Uruguay",       code: "URU", flagEmoji: "🇺🇾", groupLetter: "H" },
  { name: "Corea del Sur", code: "KOR", flagEmoji: "🇰🇷", groupLetter: "H" },
];

async function seedTeams() {
  const { count } = await prisma.team.createMany({ data: teams, skipDuplicates: true });
  console.log(count > 0 ? `✓ ${count} equipos insertados.` : "Seed omitido: equipos ya existentes.");
}

// ─── Matches ──────────────────────────────────────────────────────────────────

async function seedMatches() {
  // TODO: insertar los 64 partidos del Mundial Qatar 2022
  console.log("seedMatches: pendiente de implementar.");
}

// ─── Players ──────────────────────────────────────────────────────────────────

async function seedPlayers() {
  // TODO: insertar planteles por equipo
  console.log("seedPlayers: pendiente de implementar.");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await seedTeams();
  await seedMatches();
  await seedPlayers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
