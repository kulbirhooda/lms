import auth from "../lib/auth";
import axios from "./axios";

const authHeaders = () => ({
  Authorization: `Bearer ${auth.token}`,
});

async function signup({ name, email, password }) {
  const { data } = await axios({
    method: "post",
    url: "/api/auth/signup",
    data: { name, email, password },
  });
  return data;
}

async function signupInstructor({ name, email, password }) {
  const { data } = await axios({
    method: "post",
    url: "/api/auth/signup/instructor", // ✅ matches your backend route
    data: { name, email, password },
  });
  return data;
}

async function signin({ email, password }) {
  const { data } = await axios({
    method: "post",
    url: "/api/auth/signin",
    data: { email, password },
  });
  return data;
}

async function me() {
  const { data } = await axios({
    method: "get",
    url: "/api/auth/me",
    headers: authHeaders(),
  });
  return data;
}

export const authApi = { signup, signupInstructor, signin, me };