import axios from "axios";

// Instância do Axios para o serviço de produtos, apontando para o Gateway
const productServiceApi = axios.create({
  baseURL: "http://192.168.100.134:8765", // Apontando para o API Gateway
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Busca todas as tags de gênero (categorias) da API.
 * @returns {Promise<Array>} Uma lista de categorias.
 */
export async function getGenres() {
  const response = await productServiceApi.get('/products/tags');
  // A API pode retornar os gêneros dentro da propriedade "content" ou diretamente
  return response.data?.content || response.data || [];
}

/**
 * Busca uma lista de livros na API de produtos.
 * @param {object} options - Opções de busca.
 * @param {string} options.query - O termo de busca para os livros.
 * @param {string} options.genreTag - O ID da tag de gênero para filtrar.
 * @param {string} options.targetCurrency - A moeda para conversão (ex: 'BRL').
 * @returns {Promise<Array>} Uma lista de livros.
 */
export async function getBookList({ query = '', genreTag = '', targetCurrency = 'BRL' }) {
  // Usa o endpoint GET /products/{targetCurrency} com o parâmetro de busca
  const response = await productServiceApi.get(`/products/${targetCurrency}`, {
    params: { search: query, genreTag: genreTag }
  });
  
  // APIs Spring Boot com paginação geralmente retornam a lista dentro da propriedade "content"
  if (!response.data || !response.data.content || response.data.content.length === 0) {
    return [];
  }

  // Mapeia a resposta da sua API para o formato que o app espera
  return response.data.content.map((book) => {
    return {
      id: book.id,
      title: book.title || 'Sem título',
      author: book.author || 'Autor desconhecido',
      image: book.coverUrl ? book.coverUrl.replace(/ /g, '%20') : `https://picsum.photos/seed/${book.id}/200/300`,
      price: String(book.convertedPrice || book.price), // Prioriza o preço convertido
      // A URL para buscar detalhes do livro, que será usada pela função getBookBy
      url: `/products/${book.id}/${targetCurrency}`,
    };
  });
}

/**
 * Busca os detalhes de um livro específico.
 * @param {string} url - A URL relativa para buscar o livro (ex: /products/123/BRL).
 * @returns {Promise<Object>} Os detalhes do livro.
 */
export async function getBookBy(url) {
  const response = await productServiceApi.get(url);
  const bookData = response.data;

  // Garante que o objeto retornado tenha a propriedade 'image' formatada corretamente.
  return {
    ...bookData,
    image: bookData.coverUrl ? bookData.coverUrl.replace(/ /g, '%20') : `https://picsum.photos/seed/${bookData.id}/200/300`,
  };
}
