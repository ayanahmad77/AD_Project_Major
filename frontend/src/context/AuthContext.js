import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await SecureStore.getItemAsync("synapse_token");
      if (token) {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      }
    } catch (error) {
      await SecureStore.deleteItemAsync("synapse_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    await SecureStore.setItemAsync("synapse_token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (details) => {
    const response = await api.post("/auth/register", details);
    await SecureStore.setItemAsync("synapse_token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("synapse_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
};
