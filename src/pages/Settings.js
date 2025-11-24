import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from '../context/AuthContext';

const ProfileCard = ({ user, navigation }) => (
  <View style={styles.profileCard}>
    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('Account')}>
      <MaterialIcons name="edit" size={24} color="white" />
    </TouchableOpacity>
    <MaterialIcons name="account-circle" size={80} color="white" />
    <Text style={styles.profileName}>{user?.name || 'Usuário'}</Text>
    <Text style={styles.profileEmail}>{user?.email || 'email@exemplo.com'}</Text>
  </View>
);

const SettingItem = ({ title, icon, onPress, value }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <MaterialIcons name={icon} size={28} color="white" style={styles.icon} />
    <Text style={styles.itemText}>{title}</Text>
    {value && <Text style={styles.itemValue}>{value}</Text>}
    <MaterialIcons name="chevron-right" size={28} color="white" />
  </TouchableOpacity>
);

export default function Settings({ navigation }) {
  const { user } = useAuth();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      Alert.alert("Otimização Concluída", "Velocidade de carregamento aumentada em 0.001%.");
    }, 2000);
  };

  const settingsOptions = [
    { id: '1', title: 'Moeda Preferida', icon: 'attach-money', screen: 'CurrencySettings', value: user?.preferedCurrency, action: () => navigation.navigate('CurrencySettings') },
    { id: '2', title: 'Notificações', icon: 'notifications-none', screen: 'Notifications', action: () => navigation.navigate('Notifications') },
    { id: '3', title: 'Conta', icon: 'account-circle', screen: 'Account', action: () => navigation.navigate('Account') },
    { id: '4', title: 'Sobre o App', icon: 'info-outline', screen: 'About', action: () => navigation.navigate('About') },
  ];

  const uselessOptions = [
    { id: 'u2', title: 'Otimizar Velocidade', icon: 'speed', action: handleOptimization },
  ];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
          <ProfileCard user={user} navigation={navigation} />
          
          <Text style={styles.sectionTitle}>Configurações Gerais</Text>
          {settingsOptions.map(option => (
            <SettingItem 
              key={option.id} 
              title={option.title} 
              icon={option.icon} 
              value={option.value}
              onPress={option.action}
            />
          ))}

          <Text style={styles.sectionTitle}>Avançado</Text>
          {uselessOptions.map(option => (
            <SettingItem 
              key={option.id} 
              title={option.title} 
              icon={option.icon} 
              onPress={option.action}
            />
          ))}
        </ScrollView>

        {isOptimizing && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#1599E4" />
            <Text style={styles.loadingText}>Otimizando o kernel quântico...</Text>
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  editButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileEmail: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 20,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemValue: {
    fontSize: 16,
    color: '#999',
    marginRight: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 31, 31, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});