import React from "react";
import { Navigate, Route, Routes } from "react-router";
import useAuth from "./context/authContext";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Signin from "./Pages/Signin";

const App = () => {
  const { isLoggedIn, user } = useAuth();

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
            <div>Instructor Dashboard</div>
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