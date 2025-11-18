import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TextInput } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import BookCard from '../components/BookCard';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCart } from '../context/CartContext';

export default function MyBooks({ navigation }) {
  const { purchases } = useCart();
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load purchases from CartContext
    setLoading(true);
    setMyBooks(purchases || []);
    setLoading(false);
  }, [purchases]);

  const toggleFavorite = (bookId) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      return newFavorites;
    });
  };

  const filteredBooks = myBooks.filter(book =>
    (book.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && myBooks.length === 0) {
    return (
      <GradientBackground>
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size={"large"} color={"#fff"} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={28} color="white" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar em Meus Livros..."
              placeholderTextColor="#ccc"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BookCard
                book={item} 
                onPress={() => navigation.navigate('Home', { screen: 'BookDetail', params: { book: item } })}
                onFavorite={() => toggleFavorite(item.id)}
                isFavorite={favorites.has(item.id)}
              />
            )}
            numColumns={2}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 32,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: "#fff",
    fontSize: 16,
  },
});