import React, { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import * as CartService from "../services/CartService";
import * as InventoryService from "../services/InventoryService";
import { useInventory } from "./InventoryContext";

const CartContext = createContext({});

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const { fetchInventory } = useInventory();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const PURCHASES_KEY = "@cart:purchases";

  useEffect(() => {
    if (token && user) {
      fetchCart(user);
    } else {
      setCart(null);
    }
  }, [token, user]);

  useEffect(() => {
    async function loadPurchases() {
      try {
        const stored = await AsyncStorage.getItem(PURCHASES_KEY);
        if (stored) setPurchases(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load purchases from storage", error);
      }
    }
    loadPurchases();
  }, []);

  useEffect(() => {
    async function persistPurchases() {
      try {
        await AsyncStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
      } catch (error) {
        console.error("Failed to save purchases to storage", error);
      }
    }
    persistPurchases();
  }, [purchases]);

  async function fetchCart(currentUser) {
    if (!currentUser) {
      return;
    }
    setLoading(true);
    try {
      const userCurrency = currentUser?.preferedCurrency || 'BRL';
      const response = await CartService.getCart(userCurrency);
      const formattedCart = {
        items: (response.items?.content || []).map(item => ({
          ...item,
          id: item.productId,
        })),
        total: response.totalValue || 0,
      };
      setCart(formattedCart);
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error.response?.data || error.message);
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(product) {
    try {
      setLoading(true);
      await CartService.addItemToCart(product.id);
      await fetchCart(user);
      Alert.alert("Adicionado", `${product.title} foi adicionado ao carrinho.`);
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível adicionar o item ao carrinho.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleSelection(productId) {
    try {
      setLoading(true);
      const userCurrency = user?.preferedCurrency || 'BRL';
      await CartService.toggleItemSelection(productId, userCurrency);
      await fetchCart(user);
    } catch (error) {
      console.error("Erro ao selecionar item:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível atualizar o item.");
    } finally {
      setLoading(false);
    }
  }

  async function finalizePurchase() {
    try {
      setLoading(true);
      const purchasedItems = await CartService.checkout();

      if (purchasedItems && purchasedItems.length > 0) {
        const productIds = purchasedItems.map(item => item.productId);
        await InventoryService.addBooksToInventory(productIds);
        await fetchInventory();
        setPurchases(prev => [...prev, ...purchasedItems.filter(item => !prev.find(p => p.id === item.id))]);
        setCart({ items: [], total: 0 });
        return true;
      } else {
        Alert.alert("Atenção", "Nenhum item selecionado para compra.");
        return false;
      }
    } catch (error) {
      console.error("Erro ao finalizar compra:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível finalizar a compra.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function toggleSelectAll() {
    if (!cart || !cart.items || cart.items.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const userCurrency = user?.preferedCurrency || 'BRL';
      const areAllSelected = cart.items.every(item => item.selected);


      const togglePromises = cart.items
        .filter(item => (areAllSelected ? item.selected : !item.selected))
        .map(item => CartService.toggleItemSelection(item.productId, userCurrency));

      await Promise.all(togglePromises);
      await fetchCart(user);
    } catch (error) {
      console.error("Erro ao selecionar todos os itens:", error);
      Alert.alert("Erro", "Não foi possível atualizar a seleção de todos os itens.");
    } finally {
      setLoading(false);
    }
  }

  async function removeSelectedItems() {
    const selectedItemsCount = cart?.items?.filter(i => i.selected).length || 0;

    if (selectedItemsCount === 0) {
      Alert.alert("Atenção", "Nenhum item selecionado para remover.");
      return;
    }

    Alert.alert(
      "Confirmar Remoção",
      `Você tem certeza que deseja remover ${selectedItemsCount} item(ns) do carrinho?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await CartService.removeSelectedItems();
            await fetchCart(user);
            setLoading(false);
          },
        },
      ]
    );
  }

  async function removeSingleItem(productIdToRemove) {
    if (!cart || !cart.items) return;

    const itemToRemove = cart.items.find(item => item.productId === productIdToRemove);
    if (!itemToRemove) return;

    setLoading(true);
    try {
      const userCurrency = user?.preferedCurrency || 'BRL';

      if (!itemToRemove.selected) {
        await CartService.toggleItemSelection(productIdToRemove, userCurrency);
      }

      const otherSelectedItems = cart.items.filter(item => item.selected && item.productId !== productIdToRemove);
      const deselectPromises = otherSelectedItems.map(item => CartService.toggleItemSelection(item.productId, userCurrency));
      await Promise.all(deselectPromises);

      await CartService.removeSingleItem();

      await fetchCart(user);
      Alert.alert("Removido", "O livro foi removido do carrinho.");
    } catch (error) {
      console.error("Erro ao remover item único:", error);
      Alert.alert("Erro", "Não foi possível remover o item do carrinho.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CartContext.Provider value={{ cart, loading, purchases, addToCart, toggleSelection, toggleSelectAll, removeSelectedItems, removeSingleItem, finalizePurchase, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
