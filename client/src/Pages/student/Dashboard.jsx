import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { courseApi } from "../../api/courseApi";
import useAuth from "../../context/authContext";

const StudentDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [tab, setTab] = useState("browse");

  const fetchData = useCallback(async () => {
    try {
      const [all, enrolled] = await Promise.all([
        courseApi.getAllCourses(),
        courseApi.getEnrolledCourses(),
      ]);
      setAllCourses(all.courses);
      setEnrolledCourses(enrolled.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await courseApi.enrollInCourse(courseId);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrollingId(null);
    }
  };

  const isEnrolled = (courseId) =>
    enrolledCourses.some((c) => c.id === courseId);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800 tracking-tight">
            Student Dashboard
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

        {/* Tab Bar */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {[
            { key: "browse", label: "Browse Courses", count: allCourses.length },
            { key: "enrolled", label: "My Courses", count: enrolledCourses.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                tab === t.key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {t.label}
              <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Browse Tab */}
        {tab === "browse" && (
          <div>
            {allCourses.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-sm">No courses available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col"
                  >
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-36 object-cover bg-gray-100"
                      />
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2 flex-1">
                        {course.description}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        By {course.instructor.name} · {course._count.lessons} lessons · {course._count.enrollments} students
                      </p>
                      <div className="mt-4">
                        <button
                          onClick={() => handleEnroll(course.id)}
                          disabled={isEnrolled(course.id) || enrollingId === course.id}
                          className={`w-full py-2 rounded-lg text-xs font-semibold transition ${
                            isEnrolled(course.id)
                              ? "bg-gray-100 text-gray-400 cursor-default"
                              : "bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          }`}
                        >
                          {isEnrolled(course.id)
                            ? "✓ Enrolled"
                            : enrollingId === course.id
                            ? "Enrolling..."
                            : "Enroll Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Courses Tab */}
        {tab === "enrolled" && (
          <div>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-sm">You haven't enrolled in any courses yet.</p>
                <button
                  onClick={() => setTab("browse")}
                  className="mt-3 text-sm text-gray-900 underline underline-offset-2"
                >
                  Browse courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() =>
                      navigate("/student/courses/" + course.id, { state: { course } })
                    }
                    className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group flex flex-col"
                  >
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-36 object-cover bg-gray-100"
                      />
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2 flex-1">
                        {course.description}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        By {course.instructor.name} · {course._count.lessons} lessons
                      </p>
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <span className="text-xs font-medium text-gray-900">
                          Continue Learning →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;