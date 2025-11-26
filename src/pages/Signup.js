import React, { useState } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import GradientBackground from "../components/GradientBackground";
import InputField from "../components/InputFields";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAuth } from "../context/AuthContext";

export default function Signup({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currency, setCurrency] = useState("BRL");
  const [isLoading, setIsLoading] = useState(false);
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

    if (!currency) {
      Alert.alert("Erro", "Por favor, selecione uma moeda preferida.");
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password, currency, 1);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Não foi possível cadastrar. Tente novamente.";
      
      console.error("Falha no cadastro:", JSON.stringify(error.response?.data || error.message));

      Alert.alert("Erro no Cadastro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
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

                  <Text style={[styles.text, { marginTop: 16 }]}>moeda preferida</Text>
                  <View style={styles.currencySelector}>
                    {['BRL', 'USD', 'EUR'].map(c => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.currencyButton, currency === c && styles.currencyButtonActive]}
                        onPress={() => setCurrency(c)}
                      >
                        <Text style={[styles.currencyButtonText, currency === c && styles.currencyButtonTextActive]}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={{ marginTop: 40 }}>
                <ButtonPrimary title="Cadastrar" onPress={handleSignup} />
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.text, { padding: 16, textAlign: 'center' }]}>Já tem uma conta?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1599E4" />
        </View>
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: 50,
    paddingTop: 50,
  },
  scrollContainer: {
    flexGrow: 1
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 30,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 31, 31, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    marginTop: 8,
  },
  currencyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  currencyButtonActive: {
    backgroundColor: '#1599E4',
    borderColor: '#1599E4',
  },
  currencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  currencyButtonTextActive: {},
});
