import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const reviewServiceApi = axios.create({
  // Para o Emulador Android, use 10.0.2.2 para se conectar ao localhost do seu computador.
  // Se estiver usando um celular físico, substitua '10.0.2.2' pelo IP da sua máquina na rede.
  // Ex: baseURL: "http://192.168.1.10:8900"
  baseURL: "http://localHost:8765",
  headers: {
    "Content-Type": "application/json",
  },
});

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
 * @returns {Promise<Array>} lista de avaliações.
 */
export async function getAllReviews() {
  const response = await reviewServiceApi.get('/reviews/all');
  const reviews = response.data?.content || [];

  return reviews.map(review => ({
    id: `${review.username}-${review.postDate}`,
    username: review.username,
    postDate: review.postDate,
    grade: review.grade,
    title: review.title,
    comment: review.comment,
    book: review.book || { title: 'Livro não especificado', imageUrl: null },
  }));
}