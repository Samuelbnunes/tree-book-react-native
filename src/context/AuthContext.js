import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signin as apiSignIn, signup as apiSignUp, updateUserProfile, updateUserCurrency } from "../services/AuthService";

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
      const response = await apiSignIn(email, password);
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
      throw error;
    }
  }

  async function signup(name, email, password, currency, userType) {
    try {
      await apiSignUp(name, email, password, currency, userType);
      await signIn(email, password);
    } catch (error) {
      console.error("Falha no cadastro:", error);
      throw error;
    }
  }

  async function logout() {
    await AsyncStorage.clear();
    setUser(null);
    setToken(null);
  }

  async function updateUser(data, visualOnly = false) {
    try {
      let userToUpdate;

      if (visualOnly) {
        userToUpdate = data;
      } else {
        userToUpdate = await updateUserProfile(data);
      }
      
      setUser(userToUpdate);
      await AsyncStorage.setItem("@auth:user", JSON.stringify(userToUpdate));

      return userToUpdate;
    } catch (error) {
      console.error("Falha ao atualizar usuário:", error);
      throw error;
    }
  }

  async function updatePreferedCurrency(currency) {
    if (!user) throw new Error("Usuário não autenticado.");

    try {
      await updateUserCurrency(user.id, currency);

      const updatedUser = { ...user, preferedCurrency: currency };
      setUser(updatedUser);
      await AsyncStorage.setItem("@auth:user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error("Falha ao atualizar moeda:", error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signup, logout, updateUser, updatePreferedCurrency }}>
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
