import { markLessonComplete, getCourseProgress } from "../services/progress.service.js";

export async function postMarkComplete(req, res) {
  try {
    const { lessonId } = req.params;
    const data = await markLessonComplete({ userId: req.user.id, lessonId });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getCourseProgressController(req, res) {
  try {
    const { courseId } = req.params;
    const data = await getCourseProgress({ userId: req.user.id, courseId });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}