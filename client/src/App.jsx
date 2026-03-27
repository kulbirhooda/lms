import React from "react";
import { Navigate, Route, Routes } from "react-router";
import useAuth from "./context/authContext";
import Signup from "./Pages/Signup";
import InstructorSignup from "./Pages/InstructorSignup";
import Dashboard from "./Pages/Dashboard";
import Signin from "./Pages/Signin";
import InstructorDashboard from "./Pages/InstructorDashboard";

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
      <Route
        path="/dashboard"
        element={
          isLoggedIn && user?.role === "STUDENT" ? (
            <Dashboard />
          ) : isLoggedIn ? (
            <Navigate to="/instructor/dashboard" />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
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
        path="*"
        element={<Navigate to={isLoggedIn ? homePath : "/signin"} />}
      />
    </Routes>
  );
};

export default App;