import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { courseApi } from "../../api/courseApi";
import { assignmentApi } from "../../api/assignmentApi";

const CourseDetail = () => {
  const { courseId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [course] = useState(state?.course || null);
  const [tab, setTab] = useState("lessons");

  const [lessons, setLessons] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [assignments, setAssignments] = useState([]);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");
  const [deadline, setDeadline] = useState("");
  const [questionFile, setQuestionFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLessons = useCallback(async () => {
    try {
      const { lessons } = await courseApi.getCourseLessons(courseId);
      setLessons(lessons);
    } catch (err) {
      console.error(err);
    }
  }, [courseId]);

  const fetchAssignments = useCallback(async () => {
    try {
      const { assignments } = await assignmentApi.getCourseAssignments(courseId);
      setAssignments(assignments);
    } catch (err) {
      console.error(err);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessons();
    fetchAssignments();
  }, [fetchLessons, fetchAssignments]);

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await courseApi.addLesson(courseId, { title: lessonTitle, videoUrl });
      setLessonTitle("");
      setVideoUrl("");
      setShowLessonForm(false);
      fetchLessons();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", assignmentTitle);
      if (assignmentDesc) formData.append("description", assignmentDesc);
      if (deadline) formData.append("deadline", deadline);
      if (questionFile) formData.append("questionFile", questionFile);
      await assignmentApi.createAssignment(courseId, formData);
      setAssignmentTitle("");
      setAssignmentDesc("");
      setDeadline("");
      setQuestionFile(null);
      setShowAssignmentForm(false);
      fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/instructor/dashboard")}>
        Back to Courses
      </button>

      <h1>{course ? course.title : "Course"}</h1>
      <p>{course ? course.description : ""}</p>

      <div>
        <button
          onClick={() => { setTab("lessons"); setError(""); }}
          style={{ fontWeight: tab === "lessons" ? "bold" : "normal" }}
        >
          Lessons
        </button>
        <button
          onClick={() => { setTab("assignments"); setError(""); }}
          style={{ fontWeight: tab === "assignments" ? "bold" : "normal" }}
        >
          Assignments
        </button>
      </div>

      {tab === "lessons" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Lessons ({lessons.length})</h2>
            <button onClick={() => setShowLessonForm(!showLessonForm)}>
              {showLessonForm ? "Cancel" : "+ Add Lesson"}
            </button>
          </div>

          {showLessonForm && (
            <form onSubmit={handleAddLesson}>
              <input
                type="text"
                placeholder="Lesson Title"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Lesson"}
              </button>
            </form>
          )}

          {lessons.length === 0 ? (
            <p>No lessons yet. Add your first lesson!</p>
          ) : (
            lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}
              >
                <h3>{index + 1}. {lesson.title}</h3>
                <a href={lesson.videoUrl} target="_blank" rel="noreferrer">
                  {lesson.videoUrl}
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "assignments" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Assignments ({assignments.length})</h2>
            <button onClick={() => setShowAssignmentForm(!showAssignmentForm)}>
              {showAssignmentForm ? "Cancel" : "+ Add Assignment"}
            </button>
          </div>

          {showAssignmentForm && (
            <form onSubmit={handleCreateAssignment}>
              <input
                type="text"
                placeholder="Assignment Title"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={assignmentDesc}
                onChange={(e) => setAssignmentDesc(e.target.value)}
              />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <div>
                <label>Question PDF (optional)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setQuestionFile(e.target.files[0])}
                />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Assignment"}
              </button>
            </form>
          )}

          {assignments.length === 0 ? (
            <p>No assignments yet. Add your first assignment!</p>
          ) : (
            assignments.map((assignment) => (
  <div
    key={assignment.id}
    style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}
  >
    <h3>{assignment.title}</h3>
    {assignment.description && (
      <p>{assignment.description}</p>
    )}
    {assignment.deadline && (
      <p>{"Deadline: " + new Date(assignment.deadline).toLocaleDateString()}</p>
    )}
    {assignment.questionFileUrl && (
      <button
        onClick={() => window.open("http://localhost:4444" + assignment.questionFileUrl, "_blank")}
      >
        View Question PDF
      </button>
    )}
    <p>{assignment._count.submissions + " submissions"}</p>
  </div>
))
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;