import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";
import * as InventoryService from "../services/InventoryService";

const BookmarkContext = createContext({});

export function BookmarkProvider({ children }) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await InventoryService.getBookmarks();
      setBookmarks(data || []);
    } catch (error) {
      console.error("Erro ao buscar marcadores:", error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const createBookmark = async (description, hexColor) => {
    try {
      await InventoryService.createBookmark(description, hexColor);
      await fetchBookmarks(); // Atualiza a lista após criar
    } catch (error) {
      console.error("Erro ao criar marcador:", error);
      Alert.alert("Erro", "Não foi possível criar o marcador.");
    }
  };

  const updateBookmark = async (bookmarkId, data) => {
    try {
      await InventoryService.updateBookmark(bookmarkId, data);
      await fetchBookmarks(); // Atualiza a lista após editar
    } catch (error) {
      console.error("Erro ao atualizar marcador:", error);
      Alert.alert("Erro", "Não foi possível atualizar o marcador.");
    }
  };

  const deleteBookmark = async (bookmarkId) => {
    // Adicionando verificação de segurança para garantir que o ID é válido.
    if (!bookmarkId) {
      Alert.alert("Erro", "Não foi possível identificar o marcador para exclusão.");
      return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este marcador? Ele será removido de todos os livros.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await InventoryService.deleteBookmark(bookmarkId);
              await fetchBookmarks(); // Atualiza a lista após excluir
            } catch (error) {
              console.error("Erro ao excluir marcador:", error);
              Alert.alert("Erro", "Não foi possível excluir o marcador.");
            }
          },
        },
      ]
    );
  };

  const deleteMultipleBookmarks = async (bookmarkIds) => {
    if (!bookmarkIds || bookmarkIds.length === 0) return;

    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir ${bookmarkIds.length} marcador(es)? Eles serão removidos de todos os livros.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // Cria uma promessa para cada exclusão
              const deletePromises = bookmarkIds.map(id => InventoryService.deleteBookmark(id));
              await Promise.all(deletePromises); // Executa todas em paralelo
              await fetchBookmarks(); // Atualiza a lista
            } catch (error) {
              console.error("Erro ao excluir marcadores:", error);
              Alert.alert("Erro", "Não foi possível excluir os marcadores selecionados.");
            }
          },
        },
      ]
    );
  };

  const assignBookmarksToBook = async (productId, bookmarkIdsToAdd, bookmarkIdsToRemove) => {
    try {
      const promises = [];
      if (bookmarkIdsToAdd.length > 0) {
        bookmarkIdsToAdd.forEach(bookmarkId => {
          promises.push(InventoryService.addBookmarkToBooks(bookmarkId, [productId]));
        });
      }
      if (bookmarkIdsToRemove.length > 0) {
        bookmarkIdsToRemove.forEach(bookmarkId => {
          promises.push(InventoryService.removeBookmarkFromBooks(bookmarkId, [productId]));
        });
      }
      await Promise.all(promises);
    } catch (error) {
      console.error("Erro ao atribuir marcadores:", error);
      Alert.alert("Erro", "Não foi possível atualizar os marcadores do livro.");
    }
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, loading, fetchBookmarks, createBookmark, updateBookmark, deleteBookmark, deleteMultipleBookmarks, assignBookmarksToBook }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmark deve ser usado dentro de um BookmarkProvider");
  }
  return context;
}