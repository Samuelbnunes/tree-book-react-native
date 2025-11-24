import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getInventory,
  toggleFavoriteStatus as toggleFavoriteService, // Importação explícita e renomeada
} from '../services/InventoryService';

const InventoryContext = createContext({});

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInventory = useCallback(async (params = {}) => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getInventory(params);
      setInventory(data.content || []);
    } catch (error) {
      console.error("Erro ao buscar inventário:", error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const isBookFavorited = (productId) => {
    const book = inventory.find(item => item.productId === productId);
    return book ? book.isFavorite : false;
  };

  const toggleFavorite = async (productId) => {
    try {
      const response = await toggleFavoriteService(productId);
      const newFavoriteStatus = response.favorite;

      setInventory(prevInventory =>
        prevInventory.map(item =>
          item.productId === productId
            ? { ...item, isFavorite: newFavoriteStatus }
            : item
        )
      );

      return newFavoriteStatus;
    } catch (error) {
      console.error("Erro ao alternar favorito no contexto:", error.response?.data || error.message);
      // Re-lança o erro para que o componente que chamou possa tratá-lo, se necessário.
      throw error;
    }
  };

  const enrichBooksWithInventoryData = (books) => {
    return books.map(book => ({
      ...book,
      isFavorite: isBookFavorited(book.id),
    }));
  };

  return (
    <InventoryContext.Provider value={{ inventory, loading, fetchInventory, isBookFavorited, toggleFavorite, enrichBooksWithInventoryData }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory deve ser usado dentro de um InventoryProvider");
  }
  return context;
}