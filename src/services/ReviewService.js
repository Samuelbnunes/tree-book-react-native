import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const reviewServiceApi = axios.create({
  baseURL: "http://192.168.100.134:8765", // Apontando para o API Gateway
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador para adicionar o token JWT em todas as requisições
reviewServiceApi.interceptors.request.use(
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
 * Busca todas as avaliações da comunidade.
 * @returns {Promise<Array>} Uma lista de avaliações.
 */
export async function getAllReviews() {
  const response = await reviewServiceApi.get('/reviews/all');
  // A API retorna as avaliações dentro da propriedade "content"
  const reviews = response.data?.content || [];

  // Mapeia para garantir que a estrutura de dados seja a esperada pelo componente
  return reviews.map(review => ({
    id: `${review.username}-${review.postDate}`, // Cria um ID único
    username: review.username,
    postDate: review.postDate,
    grade: review.grade,
    title: review.title, // Título da avaliação
    comment: review.comment,
    // Assumindo que a API agora retorna um objeto 'book'
    book: review.book || { title: 'Livro não especificado', imageUrl: null },
  }));
}