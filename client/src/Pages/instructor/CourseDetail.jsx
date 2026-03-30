import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { courseApi } from "../../api/courseApi";
import { assignmentApi } from "../../api/assignmentApi";

// ─── Reusable UI Components ───────────────────────────────────────────────────

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base =
    "inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-gray-900 text-white hover:bg-gray-700 focus:ring-gray-900 px-4 py-2 text-sm",
    secondary:
      "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300 px-4 py-2 text-sm",
    ghost:
      "text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300 px-3 py-1.5 text-sm",
    danger:
      "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:ring-red-300 px-4 py-2 text-sm",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ label, className = "", ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
    )}
    <input
      className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition ${className}`}
      {...props}
    />
  </div>
);

const Textarea = ({ label, className = "", ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
    )}
    <textarea
      className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none ${className}`}
      {...props}
    />
  </div>
);

const FileInput = ({ label, hint, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
    )}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
    <input
      type="file"
      className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
      {...props}
    />
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ${className}`}
  >
    {children}
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CourseDetail = () => {
  const { courseId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [course] = useState(state?.course || null);
  const [tab, setTab] = useState("lessons");

  const [lessons, setLessons] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);

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
    if (!videoFile) {
      setError("Please select a video file");
      return;
    }
    setLoading(true);
    try {
      await courseApi.addLesson(courseId, { title: lessonTitle, videoFile });
      setLessonTitle("");
      setVideoFile(null);
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
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Top Navbar ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/instructor/dashboard")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </Button>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            Instructor View
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Course Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {course ? course.title : "Course"}
          </h1>
          {course?.description && (
            <p className="mt-1.5 text-gray-500 text-sm leading-relaxed max-w-2xl">
              {course.description}
            </p>
          )}
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {["lessons", "assignments"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                tab === t
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {t}
              <Badge className="ml-2">
                {t === "lessons" ? lessons.length : assignments.length}
              </Badge>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            LESSONS TAB
        ══════════════════════════════════════════ */}
        {tab === "lessons" && (
          <div className="space-y-4">

            {/* Add Lesson toggle */}
            <div className="flex justify-end">
              <Button
                variant={showLessonForm ? "secondary" : "primary"}
                onClick={() => setShowLessonForm(!showLessonForm)}
              >
                {showLessonForm ? (
                  "Cancel"
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Lesson
                  </>
                )}
              </Button>
            </div>

            {/* Add Lesson Form */}
            {showLessonForm && (
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">New Lesson</h3>
                <form onSubmit={handleAddLesson} className="space-y-4">
                  <Input
                    label="Lesson Title"
                    type="text"
                    placeholder="e.g. Introduction to React Hooks"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    required
                  />
                  <FileInput
                    label="Video File"
                    hint="Supported formats: mp4, mov, avi, mkv, webm"
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                  {loading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3">
                      <svg className="animate-spin w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Uploading to Cloudinary, please wait...
                    </div>
                  )}
                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2.5">{error}</p>
                  )}
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Uploading..." : "Add Lesson"}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Lesson List */}
            {lessons.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.277A1 1 0 0121 8.677V15.32a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                <p className="text-sm">No lessons yet. Add your first lesson!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <Card key={lesson.id} className="overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 bg-gray-50/70">
                      <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-gray-800">{lesson.title}</h3>
                    </div>
                    <div className="p-4">
                      <video
                        controls
                        src={lesson.videoUrl}
                        className="w-full rounded-lg bg-black aspect-video object-contain"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            ASSIGNMENTS TAB
        ══════════════════════════════════════════ */}
        {tab === "assignments" && (
          <div className="space-y-4">

            {/* Add Assignment toggle */}
            <div className="flex justify-end">
              <Button
                variant={showAssignmentForm ? "secondary" : "primary"}
                onClick={() => setShowAssignmentForm(!showAssignmentForm)}
              >
                {showAssignmentForm ? (
                  "Cancel"
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Assignment
                  </>
                )}
              </Button>
            </div>

            {/* Add Assignment Form */}
            {showAssignmentForm && (
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">New Assignment</h3>
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                  <Input
                    label="Assignment Title"
                    type="text"
                    placeholder="e.g. Build a Todo App"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    required
                  />
                  <Textarea
                    label="Description (optional)"
                    placeholder="Describe the assignment requirements..."
                    value={assignmentDesc}
                    onChange={(e) => setAssignmentDesc(e.target.value)}
                    rows={3}
                  />
                  <Input
                    label="Deadline (optional)"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                  <FileInput
                    label="Question PDF (optional)"
                    hint="Accepted: .pdf, .doc, .docx"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setQuestionFile(e.target.files[0])}
                  />
                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2.5">{error}</p>
                  )}
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Assignment"}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Assignment List */}
            {assignments.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">No assignments yet. Add your first assignment!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {assignment.title}
                        </h3>
                        {assignment.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {assignment.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          {assignment.deadline && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Due {new Date(assignment.deadline).toLocaleDateString()}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {assignment._count.submissions} submission{assignment._count.submissions !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      {assignment.questionFileUrl && (
                        <Button
                          variant="secondary"
                          onClick={() => window.open("http://localhost:4444" + assignment.questionFileUrl, "_blank")}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View PDF
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;