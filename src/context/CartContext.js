import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const STORAGE_KEY = "@cart:items";
  const PURCHASES_KEY = "@cart:purchases";

  useEffect(() => {
    async function loadCart() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setCart(JSON.parse(stored));
      } catch (error) {
        console.warn("Failed to load cart from storage", error);
      }
    }
    loadCart();
  }, []);

  useEffect(() => {
    async function persist() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.warn("Failed to save cart to storage", error);
      }
    }
    persist();
  }, [cart]);

  useEffect(() => {
    async function loadPurchases() {
      try {
        const stored = await AsyncStorage.getItem(PURCHASES_KEY);
        if (stored) setPurchases(JSON.parse(stored));
      } catch (error) {
        console.warn("Failed to load purchases from storage", error);
      }
    }
    loadPurchases();
  }, []);

  useEffect(() => {
    async function persistPurchases() {
      try {
        await AsyncStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
      } catch (error) {
        console.warn("Failed to save purchases to storage", error);
      }
    }
    persistPurchases();
  }, [purchases]);

  function addToCart(product) {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        // Não duplicar: manter apenas uma unidade por requisito
        return prev;
      }
      const item = { ...product, quantity: product.quantity ? product.quantity : 1 };
      return [...prev, item];
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  }

  function getTotal() {
    return cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  }

  function getQuantity() {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  function finalizePurchase() {
    // Move todos os itens do carrinho para purchases e limpa o carrinho
    setPurchases((prev) => {
      const next = [...prev];
      cart.forEach((item) => {
        // evitar duplicatas por id
        if (!next.find((p) => p.id === item.id)) {
          next.push(item);
        }
      });
      return next;
    });
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, purchases, addToCart, removeFromCart, getTotal, getQuantity, finalizePurchase }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

export default CartContext;
