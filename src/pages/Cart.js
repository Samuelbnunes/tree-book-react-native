import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from '../components/GradientBackground';
import ButtonPrimary from '../components/ButtonPrimary';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Cart({ navigation }) {
  const { user } = useAuth();
  const { cart, loading, toggleSelection, toggleSelectAll, removeSelectedItems, finalizePurchase, fetchCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user) fetchCart(user);
    });
    return unsubscribe;
  }, [navigation, user]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    if (user) await fetchCart(user);
    setIsRefreshing(false);
  };

  const handleFinalizePurchase = async () => {
    setIsProcessing(true);
    const success = await finalizePurchase();
    setIsProcessing(false);
    if (success) {
      navigation.navigate('PurchaseSuccess');
    }
  };

  if (loading && !cart) {
    return (
      <GradientBackground>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1599E4" />
        </View>
      </GradientBackground>
    );
  }

  const cartItems = cart?.items || [];
  const areAllItemsSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <FlatList
            data={cartItems}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                isSelected={item.selected}
                onSelect={() => toggleSelection(item.productId)}
              />
            )}
            keyExtractor={item => item.productId.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              cartItems.length > 0 ? (
                <View style={styles.selectAllContainer}>
                  <TouchableOpacity style={styles.headerButton} onPress={toggleSelectAll}>
                    <MaterialIcons name={areAllItemsSelected ? 'check-box' : 'check-box-outline-blank'} size={24} color="white" />
                    <Text style={styles.selectAllText}>Selecionar Tudo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerButton} onPress={removeSelectedItems}>
                    <MaterialIcons name="delete-outline" size={28} color="#1599E4" />
                  </TouchableOpacity>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
            }
            onRefresh={onRefresh}
            refreshing={isRefreshing}
          />
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>R$ {cart?.total?.toFixed(2) || '0.00'}</Text>
            </View>
            <ButtonPrimary
              title={isProcessing ? "Processando..." : "Finalizar Compra"}
              onPress={handleFinalizePurchase}
              disabled={isProcessing || (cart?.items || []).filter(i => i.selected).length === 0}
            />
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
  },
  selectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    padding: 10,
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    flex: 1,
  },
  footer: {
    padding: 10,
    paddingBottom: 0,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
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
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#1599E4',
  },
  checkbox: {
    marginRight: 15,
  },
  bookImage: {
    width: 60,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 4,
    backgroundColor: '#222',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  bookTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  bookPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});