import { Router } from "express";
import { getFixtureHandler } from "../controllers/meController";

const router = Router();

router.get("/", (req, res) => {
  res.json({ user: req.user });
});

router.get("/fixture", getFixtureHandler);

export default router;
