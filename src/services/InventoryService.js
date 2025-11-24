import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const inventoryServiceApi = axios.create({
  baseURL: "http://192.168.100.134:8765",
  headers: {
    "Content-Type": "application/json",
  },
});

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
export const toggleFavoriteStatus = async (productId) => {
  const response = await inventoryServiceApi.put(`/ws/inventory/favorite/${productId}`);
  return response.data;
};
