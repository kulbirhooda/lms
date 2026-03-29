import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import requireInstructor from "../middlewares/requireInstructor.js";
import requireStudent from "../middlewares/requireStudent.js";
import {
  postCreateCourse,
  getInstructorCoursesController,
  getAllCoursesController,
  postEnrollCourse,
  getEnrolledCoursesController,
  postAddLesson,
  getCourseLessonsController,
} from "../controllers/course.controller.js";

const router = Router();

// Public (any logged in user) — browse all courses
router.get("/all", requireAuth, getAllCoursesController);

// Instructor only
router.post("/", requireAuth, requireInstructor, postCreateCourse);
router.get("/", requireAuth, requireInstructor, getInstructorCoursesController);
router.post("/:courseId/lessons", requireAuth, requireInstructor, postAddLesson);
router.get("/:courseId/lessons", requireAuth, getCourseLessonsController);

// Student only
router.post("/:courseId/enroll", requireAuth, requireStudent, postEnrollCourse);
router.get("/enrolled", requireAuth, requireStudent, getEnrolledCoursesController);


export default router;