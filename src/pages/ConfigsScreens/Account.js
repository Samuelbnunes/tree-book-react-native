import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import InputField from '../../components/InputFields';
import ButtonPrimary from '../../components/ButtonPrimary';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from '../../context/AuthContext';

export default function Account({ navigation }) {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveChanges = async () => {
    if (!name.trim() || !email.trim()) {
      navigation.navigate('ActionStatus', {
        status: 'error',
        title: 'Erro',
        message: 'Nome e e-mail não podem estar vazios.',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simula a chamada à API com um pequeno atraso
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Atualiza o usuário localmente no contexto (sem chamada de API)
      await updateUser({ ...user, name, email }, true);

      navigation.navigate('ActionStatus', {
        status: 'success',
        title: 'Sucesso',
        message: 'Seu perfil foi atualizado.',
        onConfirm: () => navigation.goBack(),
      });
    } catch (error) {
      navigation.navigate('ActionStatus', {
        status: 'error',
        title: 'Erro',
        message: 'Ocorreu um erro ao tentar salvar as alterações.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.avatarSection}>
            <MaterialIcons name="account-circle" size={120} color="rgba(255, 255, 255, 0.7)" />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>nome</Text>
            <InputField value={name} onChangeText={setName} />

            <Text style={styles.label}>e-mail</Text>
            <InputField value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>

          <ButtonPrimary
            title={isLoading ? "Salvando..." : "Salvar Alterações"}
            onPress={handleSaveChanges}
            disabled={isLoading}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flexGrow: 1, padding: 20 },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  formSection: {
    marginBottom: 30,
  },
  label: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
});