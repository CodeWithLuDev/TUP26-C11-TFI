/// <reference path="./types/express.d.ts" />
import cors from "cors";
import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth";
import tourneyRouter from "./routes/tourney";
import { requireAuth } from "./middleware/requireAuth";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "REST-in-Peace API running" });
});

app.use("/api/auth", authRouter);
app.use("/api", tourneyRouter);

const meRouter = express.Router();
meRouter.get("/", (req, res) => {
  res.json({ user: req.user });
});
app.use("/api/me", requireAuth, meRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
