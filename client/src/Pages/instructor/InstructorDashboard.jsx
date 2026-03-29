import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { courseApi } from "../../api/courseApi";
import useAuth from "../../context/authContext";

const InstructorDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
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

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await courseApi.createCourse({
        title,
        description,
        thumbnail: thumbnail || undefined,
      });
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
        courses.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/instructor/courses/${course.id}`, { state: { course } })}
            style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px", cursor: "pointer" }}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>
              {course._count.lessons} lessons •{" "}
              {course._count.enrollments} students enrolled
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default InstructorDashboard;