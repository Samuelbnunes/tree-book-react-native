/**
 * Retorna a estrutura de 'source' para o componente <Image>, seja para uma URL externa ou um placeholder local.
 * @param {object} book - O objeto do livro, que deve conter a propriedade `coverUrl`.
 * @returns {object|number} O objeto `{ uri: '...' }` para imagens de rede ou o resource ID para imagens locais.
 */
export function getCoverSource(book) {
  if (book?.imageUrl) {
    return { uri: book.imageUrl };
  }
  return require('../../assets/image.png');
}

/**
 * Retorna a estrutura de 'source' para a capa de um livro usando seu ID.
 * @param {number} bookId - O ID do livro.
 * @param {string} [optionalCoverUrl] - A URL da capa, se já disponível, para evitar chamadas de API desnecessárias.
 * @returns {object|number} A estrutura de 'source' para o componente <Image>.
 */
export function getCoverSourceById(bookId, optionalCoverUrl) {
  if (optionalCoverUrl) {
    return { uri: optionalCoverUrl };
  }
  return require('../../assets/image.png');
}