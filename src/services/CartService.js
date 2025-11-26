import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const cartServiceApi = axios.create({
  // Para o Emulador Android, use 10.0.2.2 para se conectar ao localhost do seu computador.
  // Se estiver usando um celular físico, substitua '10.0.2.2' pelo IP da sua máquina na rede.
  // Ex: baseURL: "http://192.168.1.10:8900"
  baseURL: "http://localHost:8765",
  headers: {
    "Content-Type": "application/json",
  },
});

cartServiceApi.interceptors.request.use(
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
 * Busca o carrinho do usuário.
 * @param {string} targetCurrency - A moeda para conversão (ex: 'BRL').
 * @returns {Promise<Object>} O carrinho do usuário com itens e total.
 */
export const getCart = async (targetCurrency = 'BRL') => {
  const response = await cartServiceApi.get(`/ws/cart/${targetCurrency}`);
  return response.data;
};

/**
 * Adiciona um item ao carrinho.
 * @param {number} productId - O ID do produto a ser adicionado.
 * @returns {Promise<Object>} O carrinho atualizado.
 */
export const addItemToCart = async (productId) => {
  const payload = {
    items: [{ productId: productId }],
  };
  const response = await cartServiceApi.post('/ws/cart', payload);
  return response.data;
};

/**
 * Alterna o estado de seleção de um item no carrinho.
 * @param {number} productId - O ID do produto.
 * @param {string} currency - A moeda para o preço de retorno.
 * @returns {Promise<Object>} O item do carrinho atualizado.
 */
export const toggleItemSelection = async (productId, currency = 'BRL') => {
  const response = await cartServiceApi.put(`/ws/cart/select/${productId}/${currency}`);
  return response.data;
};

/**
 * Remove os itens selecionados do carrinho.
 * @returns {Promise<Array>} A lista de itens removidos.
 */
export const removeSelectedItems = async () => {
  const response = await cartServiceApi.delete('/ws/cart');
  return response.data;
};

/**
 * Remove os itens selecionados do carrinho.
 * @returns {Promise<Array>} A lista de itens removidos.
 */
export const removeSingleItem = async () => {
  // Reutiliza o mesmo endpoint DELETE, pois a lógica de seleção será feita no contexto.
  return await removeSelectedItems();
};
/**
 * Finaliza a compra dos itens selecionados no carrinho.
 * @returns {Promise<Array>} A lista de itens comprados.
 */
export const checkout = async () => {
  const response = await cartServiceApi.delete('/ws/cart');
  return response.data;
};