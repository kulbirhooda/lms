import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { getDashboard } from "../controllers/user.controller.js";

const router = Router();

router.get('/dashboard', requireAuth, getDashboard);

export default router;