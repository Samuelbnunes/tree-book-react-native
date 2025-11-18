import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CartItem from '../components/CartItem';
import ButtonPrimary from '../components/ButtonPrimary';
import { useCart } from '../context/CartContext';

export default function Cart({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const [selectedItems, setSelectedItems] = useState(new Set());

  const filteredCartItems = cart.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (itemId) => {
    setSelectedItems(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  // Calcula o total apenas dos itens selecionados
  const total = filteredCartItems
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={28} color="white" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar no carrinho..."
              placeholderTextColor="#ccc"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredCartItems}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                isSelected={selectedItems.has(item.id)}
                onSelect={() => toggleSelection(item.id)} />
            )}
            keyExtractor={item => item.id}
            style={styles.list}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
            </View>
            <ButtonPrimary title="Finalizar Compra" onPress={() => navigation.navigate('PurchaseSuccess')} />
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
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 32,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: "#fff",
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  footer: {
    padding: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalLabel: {
    color: '#ccc',
    fontSize: 18,
  },
  totalValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});