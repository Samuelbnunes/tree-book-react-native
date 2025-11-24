import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import GradientBackground from "../components/GradientBackground";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import { getBookDetails } from "../services/BookService";
import { toggleFavoriteStatus } from "../services/InventoryService";
import { getCoverSource } from "../services/ImageService";

export default function BookDetail({ route, navigation }) {
  const { inventory, isBookFavorited, toggleFavorite: toggleFavoriteInContext } = useInventory();
  const [book, setBook] = useState(route.params.book);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const bookId = route.params?.book?.id;
        if (bookId) {
          const userCurrency = user?.preferedCurrency || 'BRL';
          const updatedBook = await getBookDetails(bookId, userCurrency);
          setBook(updatedBook);
        } else {
          console.warn("Navegação para BookDetail sem a URL do livro.");
          return;
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do livro:", error);
        navigation.navigate('ActionStatus', {
          status: 'error',
          title: 'Erro',
          message: 'Não foi possível carregar os detalhes do livro.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [route.params.book, user]);

  const isFavorite = isBookFavorited(book?.id);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const isPurchased = inventory.some(item => item.productId === book.id);
        if (isPurchased) {
          return null;
        }
        return null;
      },
    });
  }, [navigation, isFavorite, book]);

  const handleToggleFavorite = async () => {
    if (!book?.id) return;
    try {
      // Chama a função do contexto, que agora retorna o novo status de favorito da API.
      const newFavoriteStatus = await toggleFavoriteInContext(book.id);
      // Atualiza o estado local do livro com o valor retornado pela API.
      setBook(prevBook => ({
        ...prevBook,
        isFavorite: newFavoriteStatus
      }));
    } catch (error) {
      console.error("Erro ao favoritar o livro:", error);
      navigation.navigate('ActionStatus', {
        status: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar o status de favorito.',
      });
    }
  };

  if (loading && !book) {
    return (
      <GradientBackground>
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size={"large"} color={"#1599E4"} />
        </View>
      </GradientBackground>
    );
  } else if (book) {

    const isPurchased = inventory.some(item => item.productId === book.id);

    return (
      <GradientBackground>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Image
              source={getCoverSource(book)}
              style={styles.image}
            />
            <Text style={styles.name}>{book?.title}</Text>
            <Text style={styles.author}>{book?.author || 'Autor Desconhecido'}</Text>

            {isPurchased && (
              <View style={styles.actionsSection}>
                <TouchableOpacity onPress={handleToggleFavorite} style={styles.actionButton} disabled={loading}>
                  <MaterialIcons name={book.isFavorite ? "favorite" : "favorite-border"} size={28} color={book.isFavorite ? "#E91E63" : "#fff"} />
                  <Text style={styles.actionText}>{book.isFavorite ? 'Favorito' : 'Favoritar'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {!isPurchased && (
              <Text style={styles.price}>
                <Text style={styles.priceCurrency}>R$ </Text>
                {parseFloat(book?.convertedPrice || book?.price || 0).toFixed(2)}
              </Text>
            )}

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
              <AddToCartButton book={book} navigation={navigation} />
            </View>
          </View>
        </ScrollView>
      </GradientBackground>
    );
  }

  return null;
}

function AddToCartButton({ book, navigation }) {
  const { inventory } = useInventory();
  const { cart, addToCart, removeSingleItem } = useCart();

  // A verificação de 'comprado' agora usa o array de objetos do inventário
  const isPurchased = inventory.some(item => item.productId === book.id);
  const isInCart = cart?.items?.some(item => item.productId === book.id);

  if (isPurchased) {
    return (
      <TouchableOpacity
        style={[styles.buttonBase, styles.purchasedButton]}
        onPress={() => navigation.navigate('ActionStatus', {
          status: 'info',
          title: 'Livro Adquirido',
          message: 'Você já possui este livro. Deseja ir para a sua biblioteca?',
          confirmButtonText: 'Ver Meus Livros',
          onConfirm: () => navigation.navigate('Meus Livros'),
        })}
      >
        <MaterialIcons name="check-circle" size={24} color="#1599E4" />
        <Text style={[styles.buttonText, styles.purchasedButtonText]}>Comprado</Text>
      </TouchableOpacity>
    );
  }

  function handleAdd() {
    if (!isInCart) {
      addToCart(book);
    }
  }

  if (isInCart) {
    return (
      <TouchableOpacity
        style={[styles.buttonBase, styles.removeButton]}
        onPress={() => removeSingleItem(book.id)}
      >
        <MaterialIcons name="remove-shopping-cart" size={24} color="#fff" />
        <Text style={styles.buttonText}>Remover do Carrinho</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.buttonBase, styles.addButton]} onPress={handleAdd}>
      <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
    </TouchableOpacity>
  );
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
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonBase: {
    height: 54,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    backgroundColor: "#1599E4",
  },
  removeButton: {
    backgroundColor: "#e91e39ff",
  },
  purchasedButton: {
    backgroundColor: "#fff",
  },
  buttonText: {
    fontFamily: "Poppins",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  purchasedButtonText: {
    color: "#1599E4",
  },
});