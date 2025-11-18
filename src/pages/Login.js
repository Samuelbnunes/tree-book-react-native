import React, { useState } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from "react-native";
import GradientBackground from "../components/GradientBackground";
import InputField from "../components/InputFields";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAuth } from "../context/AuthContext";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={{ gap: 24 }}>
            <View style={styles.logoContainer}>
              <Image source={require("../../assets/logo.png")} style={styles.logo} />
              <Text style={styles.logo_title}>TreE-Book</Text>
            </View>

            <Text style={styles.title}>Login</Text>

            <View style={{ gap: 8 }}>
              <Text style={styles.text}>email</Text>
              <InputField
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Text style={styles.text}>senha</Text>
              <InputField
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>
          <View>
            <ButtonPrimary title="Entrar" onPress={() => signIn(email, password)} />
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.text, { padding: 16, textAlign: 'center' }]}>Não tem uma conta?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: 50,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    gap: 300,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  logo_title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
    color: "white",
  },
  logoContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "left",
    color: "white",
  },
  text: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
