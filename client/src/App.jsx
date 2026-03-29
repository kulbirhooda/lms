import React from "react";
import { Navigate, Route, Routes } from "react-router";
import useAuth from "./context/authContext";
import Signup from "./Pages/Signup";
import InstructorSignup from "./Pages/InstructorSignup";
import Signin from "./Pages/Signin";
import StudentDashboard from "./Pages/student/Dashboard";
import CourseView from "./Pages/student/CourseView";
import InstructorDashboard from "./Pages/instructor/InstructorDashboard";
import CourseDetail from "./Pages/instructor/CourseDetail";

const App = () => {
  const { isLoggedIn, user } = useAuth();

  const homePath =
    user?.role === "INSTRUCTOR" ? "/instructor/dashboard" : "/dashboard";

  return (
    <Routes>
      <Route
        path="/signup"
        element={!isLoggedIn ? <Signup /> : <Navigate to={homePath} />}
      />
      <Route
        path="/instructor/signup"
        element={!isLoggedIn ? <InstructorSignup /> : <Navigate to={homePath} />}
      />
      <Route
        path="/signin"
        element={!isLoggedIn ? <Signin /> : <Navigate to={homePath} />}
      />

      {/* Student routes */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn && user?.role === "STUDENT" ? (
            <StudentDashboard />
          ) : isLoggedIn ? (
            <Navigate to="/instructor/dashboard" />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
      <Route
        path="/student/courses/:courseId"
        element={
          isLoggedIn && user?.role === "STUDENT" ? (
            <CourseView />
          ) : isLoggedIn ? (
            <Navigate to="/instructor/dashboard" />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />

      {/* Instructor routes */}
      <Route
        path="/instructor/dashboard"
        element={
          isLoggedIn && user?.role === "INSTRUCTOR" ? (
            <InstructorDashboard />
          ) : isLoggedIn ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
      <Route
        path="/instructor/courses/:courseId"
        element={
          isLoggedIn && user?.role === "INSTRUCTOR" ? (
            <CourseDetail />
          ) : isLoggedIn ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? homePath : "/signin"} />}
      />
    </Routes>
  );
};

export default App;