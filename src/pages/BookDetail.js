import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";

import GradientBackground from "../components/GradientBackground";
import ButtonPrimary from "../components/ButtonPrimary";
import { useCart } from "../context/CartContext";
import { getBookBy } from "../services/BookService";

export default function BookDetail({ route }) {
  const { url } = route.params.book;
  const [book, setBook] = useState(route.params.book); // Inicia com os dados parciais
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBook();
  }, []);

  async function getBook() {
    setLoading(true);
    try {
      const response = await getBookBy(url);
      setBook(response);
    } catch (error) {
      console.error("Erro ao buscar detalhes do livro:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do livro.");
    } finally {
      setLoading(false);
    }
  }

  if (loading && !book) {
    return (
      <GradientBackground>
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size={"large"} color={"#1599E4"} />
        </View>
      </GradientBackground>
    );
  } else if (book) {
    return (
      <GradientBackground>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Image
              source={{ uri: book?.imageUrl || book?.image }} // Usa imageUrl da API, com fallback para a imagem da lista
              style={styles.image}
            />
            <Text style={styles.name}>{book?.title}</Text>
            <Text style={styles.author}>{book?.author || 'Autor Desconhecido'}</Text>

            <Text style={styles.price}>
              <Text style={styles.priceCurrency}>R$ </Text>
              {parseFloat(book?.convertedPrice || book?.price || 0).toFixed(2)}
            </Text>

            <View style={styles.tagsContainer}>
              {book.genreTagsList?.map(tag => (
                <View key={tag.id} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.description}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sinopse</Text>
              <Text style={styles.synopsis}>{book?.synopsis || 'Nenhuma sinopse disponível.'}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalhes</Text>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Páginas:</Text>
                <Text style={styles.value}>{book?.pageCount || 'N/A'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Editora:</Text>
                <Text style={styles.value}>{book?.publisher || 'N/A'}</Text>
              </View>
            </View>

            <View style={{ width: '100%', marginTop: 24 }}>
              <AddToCartButton book={book} />
            </View>
          </View>
        </ScrollView>
      </GradientBackground>
    );
  }

  return null;
}

function AddToCartButton({ book }) {
  const { addToCart } = useCart();

  function handleAdd() {
    const item = {
      id: book.id || book.isbn || book.title,
      title: book.title,
      image: book.imageUrl || book.image, // Garante que a imagem correta vá para o carrinho
      author: book.author,
      price: book.price || 0, // Usa o preço do livro
      quantity: 1,
    };
    addToCart(item);
    Alert.alert("Adicionado", "Livro adicionado ao carrinho");
  }

  return <ButtonPrimary title="Adicionar ao Carrinho" onPress={handleAdd} />;
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingBottom: 50,
    backgroundColor: 'transparent',
  },
  image: {
    width: 200,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#222',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  priceCurrency: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#1599E4',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: 'rgba(21, 153, 228, 0.2)',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagText: {
    color: '#1599E4',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  synopsis: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    fontSize: 16,
    color: '#ccc',
  },
  value: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    textAlign: 'right',
    fontWeight: '600',
  },
});