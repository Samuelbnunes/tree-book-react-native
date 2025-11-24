import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";
import * as InventoryService from "../services/InventoryService";

const InventoryContext = createContext({});

export function InventoryProvider({ children }) {
  const { user, token } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInventory = useCallback(async () => {
    if (!user) {
      setInventory([]);
      return;
    }
    setLoading(true);
    try {
      const response = await InventoryService.getInventory();
      // Processa a resposta para garantir que os dados estejam no formato esperado pelo app.
      const inventoryBooks = (response?.content || []).map(book => ({
        ...book,
        // Padroniza o identificador para 'id'
        id: book.productId,
        // Garante que 'isFavorite' seja sempre um booleano. A API retorna 'favorite'.
        isFavorite: !!book.favorite, 
        // Garante que 'bookmarksList' seja sempre um array.
        bookmarksList: book.bookmarksList || [],
      }));
      setInventory(inventoryBooks);
    } catch (error) {
      console.error("Erro ao buscar inventário:", error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (token && user) {
      fetchInventory();
    } else {
      setInventory([]);
    }
  }, [token, user, fetchInventory]);

  /**
   * Verifica se um livro está marcado como favorito.
   * @param {number} bookId - O ID do livro a ser verificado.
   * @returns {boolean} - True se o livro for um favorito, false caso contrário.
   */
  const isBookFavorited = useCallback((bookId) => {
    const book = inventory.find(item => item.productId === bookId);
    return !!book?.isFavorite;
  }, [inventory]);

  /**
   * Alterna o status de favorito de um livro e atualiza o estado local.
   * @param {number} productId - O ID do livro.
   */
  const toggleFavorite = async (productId) => {
    // Otimistic UI update
    setInventory(prevInventory =>
      prevInventory.map(book =>
        book.productId === productId ? { ...book, isFavorite: !book.isFavorite } : book
      )
    );

    try {
      await InventoryService.toggleFavorite(productId);
    } catch (error) {
      console.error("Erro ao favoritar no contexto:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status de favorito.");
      // Reverte em caso de erro
      setInventory(prevInventory =>
        prevInventory.map(book =>
          book.productId === productId ? { ...book, isFavorite: !book.isFavorite } : book
        )
      );
    }
  };

  /**
   * Enriquece uma lista de livros com dados do inventário (favoritos, marcadores).
   * @param {Array<Object>} booksToEnrich - A lista de livros a ser enriquecida.
   * @returns {Array<Object>} A lista de livros enriquecida.
   */
  const enrichBooksWithInventoryData = useCallback((booksToEnrich) => {
    if (!inventory || inventory.length === 0 || !booksToEnrich) {
      return booksToEnrich;
    }

    return booksToEnrich.map(book => {
      const inventoryBook = inventory.find(invItem => invItem.productId === (book.id || book.productId));
      if (inventoryBook) {
        return {
          ...book,
          imageUrl: book.imageUrl || inventoryBook.imageUrl, // Garante que a imageUrl seja mantida
          isFavorite: inventoryBook.isFavorite,
          bookmarksList: inventoryBook.bookmarksList,
        };
      }
      return book;
    });
  }, [inventory]);

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