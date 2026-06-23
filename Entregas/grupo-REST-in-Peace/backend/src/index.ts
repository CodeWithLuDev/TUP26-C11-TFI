/// <reference path="./types/express.d.ts" />
import "dotenv/config";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import authRouter from "./routes/auth";
import tourneyRouter from "./routes/tourney";
import meRouter from "./routes/me";
import { requireAuth } from "./middleware/requireAuth";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "REST-in-Peace API running" });
});

app.use("/api/auth", authRouter);
app.use("/api", tourneyRouter);

app.use("/api/me", requireAuth, meRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api/docs`);
});
