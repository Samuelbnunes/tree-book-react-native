import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ButtonPrimary from '../../components/ButtonPrimary';

const statusConfig = {
  success: {
    icon: 'check-circle-outline',
    color: '#4CAF50',
  },
  error: {
    icon: 'error-outline',
    color: '#F44336',
  },
  info: {
    icon: 'info-outline',
    color: '#2196F3',
  },
};

export default function ActionStatusScreen({ route, navigation }) {
  const {
    status = 'info', // 'success', 'error', 'info'
    title,
    message,
    onConfirm,
    confirmButtonText = 'OK',
  } = route.params;

  const config = statusConfig[status];

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      navigation.goBack();
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <MaterialIcons name={config.icon} size={120} color={config.color} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{message}</Text>
          <View style={styles.buttonContainer}>
            <ButtonPrimary
              title={confirmButtonText}
              onPress={handleConfirm}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Text style={styles.closeButtonText}>Fechar</Text>
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'transparent',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 32,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#1599E4',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
});