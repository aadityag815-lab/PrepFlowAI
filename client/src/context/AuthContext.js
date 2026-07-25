import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getProfile } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("prepflow_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    setUser(data);
    localStorage.setItem("prepflow_user", JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password, college, graduationYear) => {
    const { data } = await registerUser({
      name,
      email,
      password,
      college,
      graduationYear,
    });
    setUser(data);
    localStorage.setItem("prepflow_user", JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("prepflow_user");
  };

  const refreshUser = async () => {
    try {
      const { data } = await getProfile();
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("prepflow_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
