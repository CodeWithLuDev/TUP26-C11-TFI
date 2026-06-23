import { Router } from "express";
import { getFixtureHandler } from "../controllers/meController";
import { deleteResultHandler, submitResultHandler } from "../controllers/resultController";
import { getAllStandingsHandler, getStandingsHandler } from "../controllers/standingsController";
import { getBracketHandler } from "../controllers/playoffsController";
import { getAssistersHandler, getScorersHandler } from "../controllers/statisticsController";

const router = Router();

router.get("/", (req, res) => {
  res.json({ user: req.user });
});

router.get("/fixture", getFixtureHandler);
router.get("/standings", getAllStandingsHandler);
router.get("/standings/:groupLetter", getStandingsHandler);
router.get("/bracket", getBracketHandler);
router.get("/stats/scorers", getScorersHandler);
router.get("/stats/assisters", getAssistersHandler);
router.post("/matches/:matchId/result", submitResultHandler);
router.delete("/matches/:matchId/result", deleteResultHandler);

export default router;
