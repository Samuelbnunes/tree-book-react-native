import axios from "axios";

const productServiceApi = axios.create({
  // Para o Emulador Android, use 10.0.2.2 para se conectar ao localhost do seu computador.
  // Se estiver usando um celular físico, substitua '10.0.2.2' pelo IP da sua máquina na rede.
  // Ex: baseURL: "http://192.168.1.10:8900"
  baseURL: "http://localHost:8765",
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
  const response = await productServiceApi.get(`/products/${targetCurrency}`, {
    params: { search: query, genreTag: genreTag }
  });
  
  if (!response.data || !response.data.content || response.data.content.length === 0) {
    return [];
  }

  return response.data.content.map((book) => {
    return {
      id: book.id,
      title: book.title || 'Sem título',
      synopsis: book.synopsis || 'Sem sinopse',
      publisher: book.publisher || 'Sem editora',
      imageUrl: book.imageUrl,
      pageCount: book.pageCount || 0,
      author: book.author || 'Autor desconhecido',
      convertedPrice: book.convertedPrice,
    };
  });
}

/**
 * Busca os detalhes de um livro específico.
 * @param {number} productId - O ID do produto a ser buscado.
 * @param {string} targetCurrency - A moeda para conversão.
 * @returns {Promise<Object>} Os detalhes do livro.
 */
export async function getBookDetails(productId, targetCurrency = 'BRL') {
  const response = await productServiceApi.get(`/products/${productId}/${targetCurrency}`);
  const bookData = response.data;

  return bookData;
}
