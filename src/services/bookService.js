import { apiService } from "./apiService";



// TODO: trocar pela API de livros do perdo.


export async function getBookList(query = 'react native', maxResults = 12) {
  // Usa a API do Google Books. Query pode ser personalizada.
  const q = encodeURIComponent(query);
  const response = await apiService.get(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=${maxResults}`);

  if (!response.data.items) {
    return [];
  }

  return response.data.items.map((book) => {
    const bookInfo = book.volumeInfo || {};
    const sale = book.saleInfo || {};

    const price = sale.listPrice ? String(sale.listPrice.amount) : undefined;

    return {
      id: book.id,
      title: bookInfo.title || 'Sem título',
      author: bookInfo.authors ? bookInfo.authors.join(', ') : undefined,
      image: bookInfo.imageLinks?.thumbnail ? bookInfo.imageLinks.thumbnail.replace('http://', 'https://') : `https://picsum.photos/seed/${book.id}/200/300`,
      price: price,
      url: book.selfLink,
    };
  });
}

export async function getBookBy(url) {
  const response = await apiService.get(url);
  const bookData = response.data.volumeInfo;

  const isbn13 = bookData.industryIdentifiers?.find(i => i.type === 'ISBN_13');

  return {
    id: bookData.id,
    title: bookData.title,
    author: bookData.authors ? bookData.authors.join(', ') : 'Autor desconhecido',
    pages: bookData.pageCount || 'N/A',
    isbn: isbn13 ? isbn13.identifier : 'N/A',
    image: bookData.imageLinks?.thumbnail || `https://picsum.photos/seed/${response.data.id}/200/300`,
  };
}
