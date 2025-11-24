import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Instância do Axios para o serviço de inventário, apontando para o Gateway
const inventoryServiceApi = axios.create({
  baseURL: "http://192.168.100.134:8765", // Apontando para o API Gateway
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador para adicionar o token JWT em todas as requisições
inventoryServiceApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@auth:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Busca o inventário de livros do usuário.
 * @param {object} params - Parâmetros de busca e paginação.
 * @returns {Promise<Object>} A lista de livros do inventário.
 */
export const getInventory = async (params = {}) => {
  const response = await inventoryServiceApi.get('/ws/inventory', { params });
  return response.data;
};

/**
 * Adiciona um ou mais livros ao inventário do usuário.
 * @param {Array<number>} productIds - Lista de IDs dos produtos a serem adicionados.
 * @returns {Promise<Object>}
 */
export const addBooksToInventory = async (productIds) => {
  const payload = { items: productIds.map(id => ({ productId: id })) };
  const response = await inventoryServiceApi.post('/ws/inventory', payload);
  return response.data;
};

/**
 * Alterna o status de favorito de um livro no inventário.
 * @param {number} productId - O ID do produto.
 * @returns {Promise<Object>}
 */
export const toggleFavorite = async (productId) => {
  // Garante que estamos usando o ID, mesmo que um objeto { productId: id } seja passado.
  const id = typeof productId === 'object' && productId.productId ? productId.productId : productId;
  const response = await inventoryServiceApi.put(`/ws/inventory/favorite/${id}`);
  return response.data;
};

/**
 * Lista todos os marcadores (bookmarks) pessoais do usuário.
 * @returns {Promise<Array>}
 */
export const getBookmarks = async () => {
  const response = await inventoryServiceApi.get('/ws/inventory/bookmarks');
  const bookmarks = response.data;

  // Transforma a resposta da API para o formato que o frontend espera.
  // Mapeia 'bookmarkId' para 'id'.
  if (Array.isArray(bookmarks)) {
    return bookmarks.map(bookmark => ({
      ...bookmark,
      id: bookmark.bookmarkId,
    }));
  }
  return []; // Retorna um array vazio se a resposta não for o esperado.
};

/**
 * Cria um novo marcador.
 * @param {string} description - A descrição do marcador.
 * @param {string} hexColor - A cor em formato hexadecimal (ex: #FF0000).
 * @returns {Promise<Object>}
 */
export const createBookmark = async (description, hexColor) => {
  const response = await inventoryServiceApi.post('/ws/inventory/bookmarks', { description, hexColor });
  return response.data;
};

/**
 * Atualiza a descrição e/ou cor de um marcador existente.
 * @param {number} id - O ID do marcador a ser atualizado.
 * @param {object} data - Objeto com { description, hexColor }.
 * @returns {Promise<Object>}
 */
export const updateBookmark = async (id, data) => {
  const response = await inventoryServiceApi.put(`/ws/inventory/bookmarks/${id}`, data);
  return response.data;
};

/**
 * Adiciona um marcador a uma lista de livros.
 * @param {number} bookmarkId - O ID do marcador a ser adicionado.
 * @param {Array<number>} productIds - Lista de IDs dos livros.
 * @returns {Promise<Object>}
 */
export const addBookmarkToBooks = async (bookmarkId, productIds) => {
  const payload = { productIds: productIds.map(id => ({ productId: id })) };
  const response = await inventoryServiceApi.put(`/ws/inventory/bookmarks/add/${bookmarkId}`, payload);
  return response.data;
};

/**
 * Remove um marcador de uma lista de livros.
 * @param {number} bookmarkId - O ID do marcador a ser removido.
 * @param {Array<number>} productIds - Lista de IDs dos livros.
 * @returns {Promise<Object>}
 */
export const removeBookmarkFromBooks = async (bookmarkId, productIds) => {
  const payload = { productIds: productIds.map(id => ({ productId: id })) };
  const response = await inventoryServiceApi.put(`/ws/inventory/bookmarks/remove/${bookmarkId}`, payload);
  return response.data;
};

/**
 * Exclui um marcador permanentemente.
 * @param {number} id - O ID do marcador a ser excluído.
 * @returns {Promise<Object>}
 */
export const deleteBookmark = async (id) => {
  const response = await inventoryServiceApi.delete(`/ws/inventory/bookmarks/${id}`);
  return response.data;
};