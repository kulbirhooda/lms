import React, { useState, useEffect, useCallback } from "react";
import { courseApi } from "../api/courseApi";
import useAuth from "../context/authContext";

const InstructorDashboard = () => {
  const { logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);

  // course form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  // lesson form state
  const [lessonTitle, setLessonTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCourses = useCallback(async () => {
    try {
      const { courses } = await courseApi.getInstructorCourses();
      setCourses(courses);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchLessons = useCallback(async (courseId) => {
    try {
      const { lessons } = await courseApi.getCourseLessons(courseId);
      setLessons(lessons);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setShowLessonForm(false);
    fetchLessons(course.id);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await courseApi.createCourse({ title, description, thumbnail: thumbnail || undefined });
      setTitle("");
      setDescription("");
      setThumbnail("");
      setShowCourseForm(false);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await courseApi.addLesson(selectedCourse.id, { title: lessonTitle, videoUrl });
      setLessonTitle("");
      setVideoUrl("");
      setShowLessonForm(false);
      fetchLessons(selectedCourse.id);
      fetchCourses(); // refresh lesson count
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add lesson");
    } finally {
      setLoading(false);
    }
  };

  // Course detail view
  if (selectedCourse) {
    return (
      <div>
        <button onClick={() => { setSelectedCourse(null); setLessons([]); }}>
          ← Back to Courses
        </button>
        <h1>{selectedCourse.title}</h1>
        <p>{selectedCourse.description}</p>

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
              placeholder="Video URL (YouTube, etc.)"
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
          <div>
            {lessons.map((lesson, index) => (
              <div key={lesson.id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
                <h3>{index + 1}. {lesson.title}</h3>
                <a href={lesson.videoUrl} target="_blank" rel="noreferrer">
                  {lesson.videoUrl}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Course list view
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Instructor Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <button onClick={() => setShowCourseForm(!showCourseForm)}>
        {showCourseForm ? "Cancel" : "+ Create Course"}
      </button>

      {showCourseForm && (
        <form onSubmit={handleCreateCourse}>
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Thumbnail URL (optional)"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      )}

      <h2>Your Courses ({courses.length})</h2>
      {courses.length === 0 ? (
        <p>No courses yet. Create your first one!</p>
      ) : (
        <div>
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleSelectCourse(course)}
              style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px", cursor: "pointer" }}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>{course._count.lessons} lessons • {course._count.enrollments} students enrolled</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
