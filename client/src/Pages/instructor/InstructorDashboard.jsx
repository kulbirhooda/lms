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
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800 tracking-tight">
            Instructor Dashboard
          </span>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Page header row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Your Courses
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({courses.length})
            </span>
          </h1>
          <button
            onClick={() => setShowCourseForm(!showCourseForm)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              showCourseForm
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {showCourseForm ? "Cancel" : "+ Create Course"}
          </button>
        </div>

        {/* Create Course Form */}
        {showCourseForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Course Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Complete React Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  placeholder="What will students learn?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Thumbnail URL{" "}
                  <span className="normal-case text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Creating..." : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm">No courses yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/instructor/courses/${course.id}`, { state: { course } })}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-36 object-cover rounded-lg mb-4 bg-gray-100"
                  />
                )}
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition line-clamp-2">
                  {course.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{course.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-400">
                  <span>{course._count.lessons} lessons</span>
                  <span>•</span>
                  <span>{course._count.enrollments} students</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;