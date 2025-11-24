import React, { createContext, useState, useContext, useCallback } from "react";
import { Image } from "react-native";
import { getCoverSource } from "../services/ImageService";

const ImageContext = createContext({});

export function ImageProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Pré-carrega uma lista de imagens de livros para o cache do dispositivo.
   * @param {Array<Object>} books - Uma lista de objetos de livro.
   */
  const preloadImages = useCallback(async (books) => {
    if (!books || books.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const imageUris = books
        .map(book => {
          const source = getCoverSource(book);
          return source?.uri;
        })
        .filter(uri => !!uri);

      const batchSize = 5;
      for (let i = 0; i < imageUris.length; i += batchSize) {
        const batch = imageUris.slice(i, i + batchSize);
        const prefetchPromises = batch.map(uri => Image.prefetch(uri).catch(e => {
          console.warn(`Falha ao pré-carregar imagem: ${uri}`, e.message);
        }));
        await Promise.all(prefetchPromises);
      }
    } catch (error) {
      console.warn("Falha ao pré-carregar algumas imagens:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ImageContext.Provider value={{ isLoading, preloadImages }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImage() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImage deve ser usado dentro de um ImageProvider");
  }
  return context;
}