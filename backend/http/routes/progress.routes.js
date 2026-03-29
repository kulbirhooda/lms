import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import requireStudent from "../middlewares/requireStudent.js";
import { postMarkComplete, getCourseProgressController } from "../controllers/progress.controller.js";

const router = Router();

router.post("/lessons/:lessonId/complete", requireAuth, requireStudent, postMarkComplete);
router.get("/courses/:courseId/progress", requireAuth, requireStudent, getCourseProgressController);

export default router;