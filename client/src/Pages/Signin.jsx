import React, { useState } from "react";
import useAuth from "../context/authContext";
import { useNavigate } from "react-router";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signin } = useAuth();
  const navigate = useNavigate();

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { user } = await signin({ email, password });

      // 🔥 ROLE BASED REDIRECT
      if (user.role === "INSTRUCTOR") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <>
      <form onSubmit={formSubmitHandler}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          placeholder="Enter Email"
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Enter Password"
        />

        <button type="submit">Signin</button>
      </form>

      New user?{" "}
      <button onClick={() => navigate("/signup")}>Signup</button>
    </>
  );
};

export default Signin;