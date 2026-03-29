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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Student Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <div>
        <button onClick={() => setTab("browse")}>Browse Courses</button>
        <button onClick={() => setTab("enrolled")}>My Courses</button>
      </div>

      {tab === "browse" && (
        <div>
          <h2>{"All Courses (" + allCourses.length + ")"}</h2>
          {allCourses.length === 0 ? (
            <p>No courses available yet.</p>
          ) : (
            allCourses.map((course) => (
              <div
                key={course.id}
                style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}
              >
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p>
                  {"By " + course.instructor.name + " • " + course._count.lessons + " lessons • " + course._count.enrollments + " students"}
                </p>
                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={isEnrolled(course.id) || enrollingId === course.id}
                >
                  {isEnrolled(course.id)
                    ? "Enrolled"
                    : enrollingId === course.id
                    ? "Enrolling..."
                    : "Enroll"}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "enrolled" && (
        <div>
          <h2>{"My Courses (" + enrolledCourses.length + ")"}</h2>
          {enrolledCourses.length === 0 ? (
            <p>You have not enrolled in any courses yet.</p>
          ) : (
            enrolledCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate("/student/courses/" + course.id, { state: { course } })}
                style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px", cursor: "pointer" }}
              >
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p>
                  {"By " + course.instructor.name + " • " + course._count.lessons + " lessons"}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;