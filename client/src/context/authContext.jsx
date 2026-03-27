import React, { createContext, useContext, useState } from "react";
import { authApi } from "../api/authApi";
import auth from "../lib/auth";

const context = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(auth.user ?? undefined);
  const [loading, setLoading] = useState(false);

  async function signin({ email, password }) {
    setLoading(true);
    const { user, token } = await authApi.signin({ email, password });

    auth.token = token;
    auth.user = user;

    setUser(user);
    setLoading(false);

    return { user, token };
  }

  async function signup({ name, email, password, isInstructor }) {
    setLoading(true);

    const { user, token } = isInstructor
      ? await authApi.signupInstructor({ name, email, password })
      : await authApi.signup({ name, email, password });

    auth.token = token;
    auth.user = user;

    setUser(user);
    setLoading(false);

    return { user, token };
  }

  function logout() {
    auth.logout();
    setUser(null);
  }

  return (
    <context.Provider
      value={{
        user,
        token: auth.token || "",
        signin,
        signup,
        isLoggedIn: !!user,
        loading,
        logout,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default function useAuth() {
  return useContext(context);
}