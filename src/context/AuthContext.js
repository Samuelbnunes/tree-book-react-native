import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signin as apiSignIn, signup as apiSignUp } from "../services/AuthService";

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
    try {
      // Chama a função de login do AuthService
      const response = await apiSignIn(email, password);
      // A API retorna um objeto com as propriedades { user, token }
      const { user: loggedUser, token: accessToken } = response;

      if (loggedUser && accessToken) {
        await AsyncStorage.setItem("@auth:user", JSON.stringify(loggedUser));
        await AsyncStorage.setItem("@auth:token", accessToken);
        setUser(loggedUser);
        setToken(accessToken);
      } else {
        throw new Error("Resposta inválida da API de login.");
      }
    } catch (error) {
      console.error("Falha no login:", error);
      // Re-lança o erro para que a tela possa tratá-lo (ex: mostrar um alerta)
      throw error;
    }
  }

  async function signup(name, email, password, currency, userType) {
    try {
      // Chama a função de cadastro do AuthService
      const response = await apiSignUp(name, email, password, currency, userType);
      // Supondo que a resposta contém { user, accessToken }
      const { user: newUser, accessToken } = response;

      if (newUser && accessToken) {
        await AsyncStorage.setItem("@auth:user", JSON.stringify(newUser));
        await AsyncStorage.setItem("@auth:token", accessToken);
        setUser(newUser);
        setToken(accessToken);
      } else {
        // Se não houver login automático, apenas confirme o sucesso.
        console.log("Cadastro realizado com sucesso.", response);
      }
    } catch (error) {
      console.error("Falha no cadastro:", error);
      throw error;
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
