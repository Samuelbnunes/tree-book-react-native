import React, { useState } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, Alert, TouchableOpacity } from "react-native";
import GradientBackground from "../components/GradientBackground";
import InputField from "../components/InputFields";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAuth } from "../context/AuthContext";

export default function Signup({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup } = useAuth();

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      await signup(name, email, password);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      console.warn(error);
      Alert.alert("Erro", "Não foi possível cadastrar. Tente novamente.");
    }
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={{ gap: 24 }}>
            <View style={styles.logoContainer}>
              <Image source={require("../../assets/logo.png")} style={styles.logo} />
              <Text style={styles.logo_title}>TreE-Book</Text>
            </View>

            <Text style={styles.title}>Cadastro</Text>

            <View style={{ gap: 8 }}>
              <Text style={styles.text}>nome</Text>
              <InputField value={name} onChangeText={setName} />
              <Text style={styles.text}>email</Text>
              <InputField value={email} onChangeText={setEmail} keyboardType="email-address" />
              <Text style={styles.text}>senha</Text>
              <InputField value={password} onChangeText={setPassword} secureTextEntry />
              <Text style={styles.text}>confirmar senha</Text>
              <InputField value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            </View>
          </View>

          <View>
            <ButtonPrimary title="Cadastrar" onPress={handleSignup} />
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.text, { padding: 16, textAlign: 'center' }]}>Já tem uma conta?</Text>
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
    justifyContent: 'space-between',
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
