import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const inventoryServiceApi = axios.create({
  // Para o Emulador Android, use 10.0.2.2 para se conectar ao localhost do seu computador.
  // Se estiver usando um celular físico, substitua '10.0.2.2' pelo IP da sua máquina na rede.
  // Ex: baseURL: "http://192.168.1.10:8900"
  baseURL: "http://localHost:8765",
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
 * @param {Array<number>} productIds - Lista de IDs dos produtos.
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
