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
      await apiSignUp(name, email, password, currency, userType);
      // Após o cadastro bem-sucedido, faz o login automaticamente
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
        // Se for apenas visual, usa os dados recebidos diretamente
        userToUpdate = data;
      } else {
        // Caso contrário, chama o serviço para atualizar os dados no backend
        userToUpdate = await updateUserProfile(data);
      }
      
      // Atualiza o estado local e o AsyncStorage
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
      // Chama o serviço para atualizar a moeda no backend
      await updateUserCurrency(user.id, currency);

      // Atualiza o estado local e o AsyncStorage
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
