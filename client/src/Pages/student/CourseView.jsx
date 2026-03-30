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

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading course...</p>
      </div>
    );

  const completedCount = completedIds.length;
  const progressPercent =
    progressTotal > 0 ? Math.round((completedCount / progressTotal) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          {/* Progress pill */}
          <span className="text-xs font-medium text-gray-500">
            {completedCount}/{progressTotal} lessons &nbsp;·&nbsp;
            <span className="text-gray-900 font-semibold">{progressPercent}%</span>
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Course header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {course ? course.title : "Course"}
          </h1>
          {course?.description && (
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">{course.description}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">Course Progress</span>
            <span className="text-xs font-semibold text-gray-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {completedCount} of {progressTotal} lessons completed
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {["lessons", "assignments"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                tab === t
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {t}
              <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {t === "lessons" ? lessons.length : assignments.length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Lessons Tab ── */}
        {tab === "lessons" && (
          <div className="space-y-4">
            {lessons.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm">No lessons yet.</p>
              </div>
            ) : (
              lessons.map((lesson, index) => {
                const done = completedIds.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className={`bg-white rounded-xl border transition ${
                      done ? "border-green-100" : "border-gray-100"
                    } shadow-sm overflow-hidden`}
                  >
                    {/* Lesson header */}
                    <div
                      className={`flex items-center gap-3 px-5 py-3 border-b ${
                        done ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                          done
                            ? "bg-green-500 text-white"
                            : "bg-gray-900 text-white"
                        }`}
                      >
                        {done ? "✓" : index + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {lesson.title}
                      </h3>
                      {done && (
                        <span className="ml-auto text-xs text-green-600 font-medium">
                          Completed
                        </span>
                      )}
                    </div>

                    {/* Video */}
                    <div className="p-4">
                      <video
                        controls
                        src={lesson.videoUrl}
                        className="w-full rounded-lg bg-black aspect-video object-contain"
                      />
                    </div>

                    {/* Mark complete */}
                    {!done && (
                      <div className="px-4 pb-4">
                        <button
                          onClick={() => handleMarkComplete(lesson.id)}
                          disabled={markingId === lesson.id}
                          className="w-full py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {markingId === lesson.id ? "Marking..." : "Mark as Complete"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Assignments Tab ── */}
        {tab === "assignments" && (
          <div className="space-y-4">
            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2.5">{error}</p>
            )}
            {assignments.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm">No assignments yet.</p>
              </div>
            ) : (
              assignments.map((assignment) => {
                const submitted = submittedIds.includes(assignment.id);
                return (
                  <div
                    key={assignment.id}
                    className={`bg-white rounded-xl border shadow-sm p-5 transition ${
                      submitted ? "border-green-100" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {assignment.title}
                          </h3>
                          {submitted && (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              Submitted ✓
                            </span>
                          )}
                        </div>
                        {assignment.description && (
                          <p className="mt-1 text-sm text-gray-500">{assignment.description}</p>
                        )}
                        {assignment.deadline && (
                          <p className="mt-1.5 text-xs text-gray-400">
                            Due {new Date(assignment.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {assignment.questionFileUrl && (
                        <button
                          onClick={() =>
                            window.open(
                              "http://localhost:4444" + assignment.questionFileUrl,
                              "_blank"
                            )
                          }
                          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                          View PDF
                        </button>
                      )}
                    </div>

                    {!submitted && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) =>
                            setSelectedFiles((prev) => ({
                              ...prev,
                              [assignment.id]: e.target.files[0],
                            }))
                          }
                          className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                        />
                        <button
                          onClick={() => handleSubmitAssignment(assignment.id)}
                          disabled={submittingId === assignment.id}
                          className="flex-shrink-0 px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
    </div>
  );
};

export default CourseView;