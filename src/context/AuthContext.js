import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStored() {
      try {
        const storedUser = await AsyncStorage.getItem("@auth:user");
        const storedToken = await AsyncStorage.getItem("@auth:token");
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.warn("Failed to load auth from storage", error);
      } finally {
        setLoading(false);
      }
    }
    loadStored();
  }, []);

  async function signIn(email, password) {
    // Simula login: em produção, chame a API e armazene token/usuário reais
    const simulatedUser = { email };
    const simulatedToken = "demo-token";
    try {
      await AsyncStorage.setItem("@auth:user", JSON.stringify(simulatedUser));
      await AsyncStorage.setItem("@auth:token", simulatedToken);
      setUser(simulatedUser);
      setToken(simulatedToken);
    } catch (error) {
      console.warn("Failed to save auth to storage", error);
    }
  }

  async function signup(name, email, password) {
    // Simula cadastro: em produção, chamar a API para criar usuário
    const simulatedUser = { name, email };
    const simulatedToken = "demo-token";
    try {
      await AsyncStorage.setItem("@auth:user", JSON.stringify(simulatedUser));
      await AsyncStorage.setItem("@auth:token", simulatedToken);
      setUser(simulatedUser);
      setToken(simulatedToken);
    } catch (error) {
      console.warn("Failed to save auth to storage", error);
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem("@auth:user");
      await AsyncStorage.removeItem("@auth:token");
    } catch (error) {
      console.warn("Failed to clear auth storage", error);
    } finally {
      setUser(null);
      setToken(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export default AuthContext;
