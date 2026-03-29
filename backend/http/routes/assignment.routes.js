import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import requireInstructor from "../middlewares/requireInstructor.js";
import requireStudent from "../middlewares/requireStudent.js";
import { uploadAssignment, uploadQuestion } from "../middlewares/upload.js";
import {
  postCreateAssignment,
  getCourseAssignmentsController,
  postSubmitAssignment,
  getStudentSubmissionsController,
} from "../controllers/assignment.controller.js";

const router = Router();

// Instructor — create assignment with optional question PDF
router.post(
  "/courses/:courseId/assignments",
  requireAuth,
  requireInstructor,
  uploadQuestion.single("questionFile"),
  postCreateAssignment
);

// Anyone logged in — view assignments for a course
router.get("/courses/:courseId/assignments", requireAuth, getCourseAssignmentsController);

// Student — submit assignment with file
router.post(
  "/assignments/:assignmentId/submit",
  requireAuth,
  requireStudent,
  uploadAssignment.single("file"),
  postSubmitAssignment
);

// Student — view own submissions
router.get("/assignments/submissions", requireAuth, requireStudent, getStudentSubmissionsController);

export default router;