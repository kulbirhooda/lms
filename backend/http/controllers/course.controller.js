import { createCourseSchema } from "../schemas/course.schemas.js";
import {
  createCourse,
  getInstructorCourses,
  getAllCourses,
  enrollInCourse,
  getEnrolledCourses,
  addLesson,
  getCourseLessons,
} from "../services/course.service.js";

export async function postCreateCourse(req, res) {
  try {
    const result = createCourseSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const data = await createCourse({
      ...result.data,
      instructorId: req.user.id,
    });
    return res.status(201).json(data);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getInstructorCoursesController(req, res) {
  try {
    const data = await getInstructorCourses(req.user.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getAllCoursesController(req, res) {
  try {
    const data = await getAllCourses();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function postEnrollCourse(req, res) {
  try {
    const { courseId } = req.params;
    const data = await enrollInCourse({ courseId, userId: req.user.id });
    return res.status(201).json(data);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getEnrolledCoursesController(req, res) {
  try {
    const data = await getEnrolledCourses(req.user.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function postAddLesson(req, res) {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!req.file) return res.status(400).json({ error: "Video file is required" });

    // Cloudinary returns the full URL in req.file.path
    const videoUrl = req.file.path;

    const data = await addLesson({ courseId, title, videoUrl });
    return res.status(201).json(data);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getCourseLessonsController(req, res) {
  try {
    const { courseId } = req.params;
    const data = await getCourseLessons(courseId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}