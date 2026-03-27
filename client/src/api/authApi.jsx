import auth from "../lib/auth";
import axios from "./axios";

async function signup({ name, email, password }) {
  const { data } = await axios({  // ✅ one level deep
    method: "post",
    url: "/api/auth/signup",
    data: { name, email, password },
  });
  return data; // returns { user, token }
}

async function signin({ email, password }) {
  const { data } = await axios({  // ✅ one level deep
    method: "post",
    url: "/api/auth/signin",
    data: { email, password },
  });
  return data; // returns { user, token }
}

async function me() {
  const { data } = await axios({  // ✅ one level deep
    method: "get",               // ✅ should be GET not POST
    url: "/api/auth/me",
    headers: {
      Authorization: `Bearer ${auth.token || ""}`,
    },
  });
  return data;
}

export const authApi = { signup, signin, me };