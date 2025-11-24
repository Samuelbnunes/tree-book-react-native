import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import GradientBackground from '../components/GradientBackground';
import InputField from '../components/InputFields';
import ButtonPrimary from '../components/ButtonPrimary';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [imageUri, setImageUri] = useState(null); // A API não suporta imagem, então isso é apenas visual
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async () => {
    // Pede permissão para acessar a galeria de mídia
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Necessária', 'Precisamos de permissão para acessar sua galeria de fotos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Erro", "Nome e e-mail não podem estar vazios.");
      return;
    }

    setIsLoading(true);
    try {
      await updateUser({ name, email });
      Alert.alert("Sucesso", "Seu perfil foi atualizado.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar seu perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={handleImagePick} style={styles.avatarContainer}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.avatar} />
              ) : (
                <MaterialIcons name="account-circle" size={120} color="rgba(255, 255, 255, 0.7)" />
              )}
              <View style={styles.editIconContainer}>
                <MaterialIcons name="edit" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Nome</Text>
            <InputField value={name} onChangeText={setName} />

            <Text style={styles.label}>E-mail</Text>
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
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#1599E4',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1599E4',
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: '#1f1f1f',
  },
  formSection: {
    marginBottom: 30,
  },
  label: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 8,
  },
});