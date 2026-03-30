import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { courseApi } from "../../api/courseApi";
import { assignmentApi } from "../../api/assignmentApi";
import { progressApi } from "../../api/progressApi";

const CourseView = () => {
  const { courseId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [course] = useState(state?.course || null);
  const [tab, setTab] = useState("lessons");

  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [progressTotal, setProgressTotal] = useState(0);

  const [submittingId, setSubmittingId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [submittedIds, setSubmittedIds] = useState([]);
  const [markingId, setMarkingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      const [lessonsRes, assignmentsRes, progressRes, submissionsRes] = await Promise.all([
        courseApi.getCourseLessons(courseId),
        assignmentApi.getCourseAssignments(courseId),
        progressApi.getCourseProgress(courseId),
        assignmentApi.getMySubmissions(),
      ]);
      setLessons(lessonsRes.lessons);
      setAssignments(assignmentsRes.assignments);
      setCompletedIds(progressRes.completedLessonIds);
      setProgressTotal(progressRes.total);
      const submitted = submissionsRes.submissions
        .map((s) => s.assignmentId)
        .filter(Boolean);
      setSubmittedIds(submitted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleMarkComplete = async (lessonId) => {
    setMarkingId(lessonId);
    try {
      await progressApi.markComplete(lessonId);
      setCompletedIds((prev) => [...prev, lessonId]);
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingId(null);
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) {
      alert("Please select a file first");
      return;
    }
    setSubmittingId(assignmentId);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      await assignmentApi.submitAssignment(assignmentId, formData);
      setSubmittedIds((prev) => [...prev, assignmentId]);
      setSelectedFiles((prev) => ({ ...prev, [assignmentId]: null }));
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  const completedCount = completedIds.length;
  const progressPercent = progressTotal > 0
    ? Math.round((completedCount / progressTotal) * 100)
    : 0;

  return (
    <div>
      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      <h1>{course ? course.title : "Course"}</h1>
      <p>{course ? course.description : ""}</p>

      {/* Progress Bar */}
      <div style={{ margin: "16px 0" }}>
        <p>{"Progress: " + completedCount + " / " + progressTotal + " lessons completed (" + progressPercent + "%)"}</p>
        <div style={{ background: "#eee", borderRadius: "8px", height: "12px", width: "100%" }}>
          <div
            style={{
              background: "#4caf50",
              borderRadius: "8px",
              height: "12px",
              width: progressPercent + "%",
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div>
        <button
          onClick={() => setTab("lessons")}
          style={{ fontWeight: tab === "lessons" ? "bold" : "normal" }}
        >
          Lessons
        </button>
        <button
          onClick={() => setTab("assignments")}
          style={{ fontWeight: tab === "assignments" ? "bold" : "normal" }}
        >
          Assignments
        </button>
      </div>

      {/* Lessons Tab */}
      {tab === "lessons" && (
        <div>
          <h2>{"Lessons (" + lessons.length + ")"}</h2>
          {lessons.length === 0 ? (
            <p>No lessons yet.</p>
          ) : (
            lessons.map((lesson, index) => {
              const done = completedIds.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  style={{
                    border: "1px solid #ccc",
                    margin: "10px 0",
                    padding: "10px",
                    background: done ? "#f0fff0" : "#fff",
                  }}
                >
                  <h3>{(index + 1) + ". " + lesson.title + (done ? " ✓" : "")}</h3>
                  <video
                    controls
                    width="100%"
                    src={lesson.videoUrl}
                    style={{ marginTop: "8px" }}
                />
                  {!done && (
                    <button
                      onClick={() => handleMarkComplete(lesson.id)}
                      disabled={markingId === lesson.id}
                    >
                      {markingId === lesson.id ? "Marking..." : "Mark as Complete"}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Assignments Tab */}
      {tab === "assignments" && (
        <div>
          <h2>{"Assignments (" + assignments.length + ")"}</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {assignments.length === 0 ? (
            <p>No assignments yet.</p>
          ) : (
            assignments.map((assignment) => {
              const submitted = submittedIds.includes(assignment.id);
              return (
                <div
                  key={assignment.id}
                  style={{
                    border: "1px solid #ccc",
                    margin: "10px 0",
                    padding: "10px",
                    background: submitted ? "#f0fff0" : "#fff",
                  }}
                >
                  <h3>{assignment.title + (submitted ? " ✓ Submitted" : "")}</h3>
                  {assignment.description && <p>{assignment.description}</p>}
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
                  {!submitted && (
                    <div style={{ marginTop: "8px" }}>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          setSelectedFiles((prev) => ({
                            ...prev,
                            [assignment.id]: e.target.files[0],
                          }))
                        }
                      />
                      <button
                        onClick={() => handleSubmitAssignment(assignment.id)}
                        disabled={submittingId === assignment.id}
                      >
                        {submittingId === assignment.id ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CourseView;