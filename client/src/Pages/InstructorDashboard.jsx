import React from "react";
import useAuth from "../context/authContext";

const InstructorDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Instructor Dashboard</h1>

      <p>Welcome, {user?.name}</p>
      <p>Email: {user?.email}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default InstructorDashboard;