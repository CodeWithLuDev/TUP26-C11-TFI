import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  getTeamsHandler,
  getMatchesHandler,
  getPlayersHandler,
} from "../controllers/tourneyController";

const router = Router();

router.get("/teams", requireAuth, getTeamsHandler);
router.get("/matches", requireAuth, getMatchesHandler);
router.get("/players", requireAuth, getPlayersHandler);

export default router;
