import {
  createAssignment,
  getCourseAssignments,
  submitAssignment,
  getStudentSubmissions,
} from "../services/assignment.service.js";

export async function postCreateAssignment(req, res) {
  try {
    const { courseId } = req.params;
    const { title, description, deadline } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    // attach question PDF url if uploaded
    const questionFileUrl = req.file
      ? `/uploads/questions/${req.file.filename}`
      : null;

    const data = await createAssignment({
      courseId,
      title,
      description,
      deadline,
      questionFileUrl,
    });
    return res.status(201).json(data);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getCourseAssignmentsController(req, res) {
  try {
    const { courseId } = req.params;
    const data = await getCourseAssignments(courseId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function postSubmitAssignment(req, res) {
  try {
    const { assignmentId } = req.params;
    if (!req.file) return res.status(400).json({ error: "File is required" });
    const fileUrl = `/uploads/assignments/${req.file.filename}`;
    const { note } = req.body;
    const data = await submitAssignment({
      assignmentId,
      userId: req.user.id,
      fileUrl,
      note,
    });
    return res.status(201).json(data);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getStudentSubmissionsController(req, res) {
  try {
    const data = await getStudentSubmissions(req.user.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}