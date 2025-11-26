import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../../components/GradientBackground';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const NotificationSettingItem = ({ title, description, icon, value, onValueChange }) => (
  <View style={styles.itemContainer}>
    <MaterialIcons name={icon} size={28} color="white" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemDescription}>{description}</Text>
    </View>
    <Switch
      trackColor={{ false: "#767577", true: "#1599E4" }}
      thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

export default function Notifications() {
  const [settings, setSettings] = useState({
    likes: false,
    promos: true,
    reminders: false,
    kernel: true,
    aliens: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const storedSettings = await AsyncStorage.getItem('@notifications:settings');
        if (storedSettings !== null) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (e) {
        console.error("Falha ao carregar configurações de notificação.", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleValueChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem('@notifications:settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error("Falha ao salvar configuração de notificação.", e);
    }
  };

  const notificationOptions = [
    { key: 'likes', title: 'Likes em Avaliações', description: 'Receber quando alguém curtir sua avaliação.', icon: 'thumb-up-off-alt' },
    { key: 'promos', title: 'Promoções Imperdíveis', description: 'Alertas de livros que você provavelmente não vai comprar.', icon: 'local-offer' },
    { key: 'reminders', title: 'Lembretes de Leitura', description: 'Avisos para continuar o livro que você ignora há 3 meses.', icon: 'book' },
    { key: 'kernel', title: 'Atualizações do Kernel', description: 'Manter-se informado sobre o fluxo de nêutrons do app.', icon: 'memory' },
    { key: 'aliens', title: 'Invasão Alienígena', description: 'Receber um alerta 5 minutos antes da chegada.', icon: 'public' },
  ];

  if (loading) {
    return (
      <GradientBackground>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#1599E4" />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <Text style={styles.sectionTitle}>Notificações Push</Text>
          {notificationOptions.map(option => (
            <NotificationSettingItem
              key={option.key}
              title={option.title}
              description={option.description}
              icon={option.icon}
              value={settings[option.key]}
              onValueChange={(value) => handleValueChange(option.key, value)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 10 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemDescription: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 2,
  },
});