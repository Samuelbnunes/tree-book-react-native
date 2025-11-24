import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from '../../context/AuthContext';

const currencies = [
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
];

const CurrencyItem = ({ currency, isSelected, onSelect }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={() => onSelect(currency.code)}>
    <Text style={styles.flag}>{currency.flag}</Text>
    <View style={styles.textContainer}>
      <Text style={styles.itemTitle}>{currency.name}</Text>
      <Text style={styles.itemCode}>{currency.code}</Text>
    </View>
    {isSelected && <MaterialIcons name="check-circle" size={28} color="#1599E4" />}
  </TouchableOpacity>
);

export default function CurrencySettings() {
  const { user, updatePreferedCurrency } = useAuth();

  const handleCurrencySelect = async (currencyCode) => {
    if (user?.preferedCurrency === currencyCode) return;

    try {
      await updatePreferedCurrency(currencyCode);
      Alert.alert("Sucesso", `Moeda alterada para ${currencyCode}.`);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar a moeda.");
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <Text style={styles.sectionTitle}>Selecione sua moeda preferida</Text>
          {currencies.map(currency => (
            <CurrencyItem
              key={currency.code}
              currency={currency}
              isSelected={user?.preferedCurrency === currency.code}
              onSelect={handleCurrencySelect}
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
  flag: {
    fontSize: 32,
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
  itemCode: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
  },
});