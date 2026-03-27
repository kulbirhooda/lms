import React, { useState } from "react";
import useAuth from "../context/authContext";
import { useNavigate } from "react-router";

const InstructorSignup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const { user } = await signup({
      name,
      email,
      password,
      isInstructor: true, // ✅ instructor signup
    });
    navigate("/instructor/dashboard");
  };

  return (
    <>
      <form onSubmit={formSubmitHandler}>
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Enter Email" />
        <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Enter Name" />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Enter Password" />
        <button type="submit">Signup as Instructor</button>
      </form>
      Already have an account?{" "}
      <button onClick={() => navigate("/signin")}>Signin</button>
    </>
  );
};

export default InstructorSignup;