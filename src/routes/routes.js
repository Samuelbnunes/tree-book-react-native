import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator, StatusBar } from "react-native";
import AuthStack from "./AuthStack";
import Home from "../pages/Home";
import { useAuth } from "../context/AuthContext";
import GradientBackground from "../components/GradientBackground";

export default function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <GradientBackground>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#1599E4" />
          </View>
        </GradientBackground>
      </>
    );
  }

  return (
    <NavigationContainer>
      {user ? <Home /> : <AuthStack />}
    </NavigationContainer>
  );
}
