import React, { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import * as CartService from "../services/CartService";

const CartContext = createContext({});

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cart, setCart] = useState(null); // Inicia como null para indicar que não foi carregado
  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const PURCHASES_KEY = "@cart:purchases";

  // Carrega o carrinho da API quando o usuário faz login
  useEffect(() => {
    // Garante que a busca só ocorra quando ambos, token e user, estiverem disponíveis.
    if (token && user) {
      fetchCart(user); // Passa o usuário ao carregar inicialmente
    } else {
      // Limpa o carrinho se não houver token (logout)
      setCart(null);
    }
  }, [token, user]); // Adiciona 'user' como dependência para evitar race conditions.

  // Carrega as compras salvas localmente (isso pode ser movido para uma API no futuro)
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

  // Persiste as compras no armazenamento local
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
        items: response.items?.content || [],
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
      // Após adicionar, busca o carrinho atualizado para garantir consistência e preços convertidos.
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
      // A API alterna a seleção, então apenas chamamos e atualizamos o estado
      await CartService.toggleItemSelection(productId, userCurrency);
      // Recarrega o carrinho para obter o estado mais recente
      await fetchCart(user); // Passa o usuário atual
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
        // Adiciona os itens comprados à lista local de compras
        setPurchases(prev => [...prev, ...purchasedItems.filter(item => !prev.find(p => p.id === item.id))]);
        // Limpa o carrinho localmente
        setCart({ items: [], total: 0 });
        return true; // Indica sucesso
      } else {
        Alert.alert("Atenção", "Nenhum item selecionado para compra.");
        return false; // Indica que nada foi comprado
      }
    } catch (error) {
      console.error("Erro ao finalizar compra:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível finalizar a compra.");
      return false; // Indica falha
    } finally {
      setLoading(false);
    }
  }

  async function toggleSelectAll() {
    if (!cart || !cart.items || cart.items.length === 0) {
      return; // Não há itens para selecionar
    }
    setLoading(true);
    try {
      const userCurrency = user?.preferedCurrency || 'BRL';
      // Verifica se todos os itens já estão selecionados
      const areAllSelected = cart.items.every(item => item.selected);

      // Cria uma lista de promessas para alternar a seleção de cada item necessário
      const togglePromises = cart.items
        .filter(item => (areAllSelected ? item.selected : !item.selected)) // Se todos estão selecionados, desmarca todos. Senão, marca os que não estão.
        .map(item => CartService.toggleItemSelection(item.productId, userCurrency));

      await Promise.all(togglePromises);
      await fetchCart(user); // Busca o estado final do carrinho
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
          // A lógica de remoção agora fica dentro do 'onPress' do botão de confirmação
          onPress: async () => {
            setLoading(true);
            await CartService.removeSelectedItems();
            await fetchCart(user); // Busca o carrinho atualizado
            setLoading(false);
          },
        },
      ]
    );
  }

  async function removeSingleItem(productIdToRemove) {
    if (!cart || !cart.items) return;

    const itemToRemove = cart.items.find(item => item.productId === productIdToRemove);
    if (!itemToRemove) return; // Item não está no carrinho

    setLoading(true);
    try {
      const userCurrency = user?.preferedCurrency || 'BRL';

      // Garante que o item a ser removido esteja selecionado
      if (!itemToRemove.selected) {
        await CartService.toggleItemSelection(productIdToRemove, userCurrency);
      }

      // Desmarca todos os outros itens para que não sejam removidos acidentalmente
      const otherSelectedItems = cart.items.filter(item => item.selected && item.productId !== productIdToRemove);
      const deselectPromises = otherSelectedItems.map(item => CartService.toggleItemSelection(item.productId, userCurrency));
      await Promise.all(deselectPromises);

      // Agora, com apenas o item desejado selecionado, remove-o
      await CartService.removeSingleItem();

      // Busca o estado final do carrinho
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
