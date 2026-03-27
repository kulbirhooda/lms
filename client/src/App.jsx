import React from "react";
import { Navigate, Route, Routes } from "react-router";
import useAuth from "./context/authContext";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Signin from "./Pages/Signin";
import InstructorDashboard from "./Pages/InstructorDashboard";

const App = () => {
  const { isLoggedIn, user } = useAuth();

  // 🔥 prevent rendering until user is checked
  if (user === undefined) return null;

  return (
    <Routes>
      {/* Signup */}
      <Route
        path="/signup"
        element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />}
      />

      {/* Signin */}
      <Route
        path="/signin"
        element={!isLoggedIn ? <Signin /> : <Navigate to="/dashboard" />}
      />

      {/* Student Dashboard */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn && user?.role === "STUDENT" ? (
            <Dashboard />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />

      {/* Instructor Dashboard */}
      <Route
        path="/instructor/dashboard"
        element={
          isLoggedIn && user?.role === "INSTRUCTOR" ? (
            <InstructorDashboard />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />

      {/* Default */}
      <Route path="*" element={<Navigate to="/signup" />} />
    </Routes>
  );
};

export default App;