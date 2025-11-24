import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import GradientBackground from "../components/GradientBackground";
import ButtonPrimary from "../components/ButtonPrimary";
import { useCart } from "../context/CartContext";
import { useInventory } from "../context/InventoryContext";
import { useBookmark } from "../context/BookmarkContext";
import { getBookBy, toggleFavorite } from "../services/BookService";
import ManageBookmarksModal from "../components/ManageBookmarksModal";
import { getCoverSource } from "../services/ImageService";

export default function BookDetail({ route, navigation }) {
  const { assignBookmarksToBook } = useBookmark();
  const { inventory, isBookFavorited, toggleFavorite: toggleFavoriteInContext } = useInventory();
  const [book, setBook] = useState(route.params.book);
  const [loading, setLoading] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null); // Para o modal de marcadores

  const isFavorite = isBookFavorited(book?.productId);

  // Atualiza o cabeçalho com o botão de favoritar
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const isPurchased = inventory.some(item => item.productId === book.productId || item.productId === book.id);
        // Só mostra os botões se o livro estiver no inventário (comprado)
        if (isPurchased) {
          return (
            <View style={{ flexDirection: 'row', gap: 15, marginRight: 15 }}>
              <TouchableOpacity onPress={() => setIsAssignModalVisible(true)}>
                <MaterialIcons name="bookmark-add" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleFavoriteInContext(book.productId || book.id)}>
                <MaterialIcons name={isFavorite ? "favorite" : "favorite-border"} size={28} color={isFavorite ? "#E91E63" : "#fff"} />
              </TouchableOpacity>
            </View>
          );
        }
        return null;
      },
    });
  }, [navigation, isFavorite, book]);

  const handleSaveAssignedBookmarks = async (newBookmarkIds) => {
    if (!book) return;

    const initialBookmarkIds = new Set(book.bookmarksList?.map(b => b.id) || []);
    const finalBookmarkIds = new Set(newBookmarkIds);

    const idsToAdd = [...finalBookmarkIds].filter(id => !initialBookmarkIds.has(id));
    const idsToRemove = [...initialBookmarkIds].filter(id => !finalBookmarkIds.has(id));

    await assignBookmarksToBook(book.productId, idsToAdd, idsToRemove);

    // Atualiza o estado local do livro para refletir as mudanças nos marcadores
    const updatedBook = await getBookBy(book.productId || book.id);
    setBook(prevBook => ({
      ...prevBook,
      ...updatedBook,
      bookmarksList: updatedBook.bookmarksList || [],
    }));
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
              <AddToCartButton book={book} navigation={navigation} />
            </View>
          </View>
        </ScrollView>
        {/* Modal para gerenciar marcadores (criação/edição) */}
        <ManageBookmarksModal
          visible={isAssignModalVisible}
          onClose={() => {
            setIsAssignModalVisible(false);
            setEditingBookmark(null); // Limpa o marcador em edição
          }}
          bookmarkToEdit={editingBookmark}
          // onSave é tratado dentro do ManageBookmarksModal
        />
      </GradientBackground>
    );
  }

  return null;
}

function AddToCartButton({ book, navigation }) {
  const { inventory } = useInventory();
  const { cart, addToCart, removeSingleItem } = useCart();

  // A verificação de 'comprado' agora usa o array de objetos do inventário
  const isPurchased = inventory.some(item => item.productId === book.productId || item.productId === book.id);
  const isInCart = cart?.items?.some(item => item.productId === (book.productId || book.id));

  if (isPurchased) {
    return (
      <TouchableOpacity 
        style={[styles.buttonBase, styles.purchasedButton]}
        onPress={() => Alert.alert(
          "Livro Adquirido",
          "Você já possui este livro. Deseja ir para a sua biblioteca?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Ver Meus Livros", onPress: () => navigation.navigate('Meus Livros') }
          ]
        )}
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
        onPress={() => removeSingleItem(book.productId || book.id)}
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
  // Estilos para os botões de ação
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