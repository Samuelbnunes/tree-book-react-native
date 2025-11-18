import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ButtonPrimary from '../components/ButtonPrimary';
import { useCart } from '../context/CartContext';

export default function PurchaseSuccess({ navigation }) {
  const { finalizePurchase } = useCart();

  useEffect(() => {
    // Quando a tela de sucesso é exibida, finalize a compra (mover itens para purchases)
    finalizePurchase();
  }, []);
  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <MaterialIcons name="check-circle-outline" size={120} color="white" />
          <Text style={styles.title}>Compra Realizada com Sucesso!</Text>
          <Text style={styles.subtitle}>Seu pedido foi processado e em breve você receberá mais informações.</Text>
          <View style={styles.buttonContainer}>
            <ButtonPrimary title="Voltar para o Carrinho" onPress={() => navigation.popToTop()} />
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
  }
});