import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import BookListItem from '../components/BookListItem'; // Importa o novo componente
import { getBookList } from '../services/BookService';
import { useAuth } from '../context/AuthContext';

export default function AllBookList({ route, navigation }) {
  // Recebe o ID da categoria pelos parâmetros da navegação
  const { genreId } = route.params;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchBooks() {
      if (!genreId) return;
      setLoading(true);
      try {
        const userCurrency = user?.preferedCurrency || 'BRL';
        // Busca os livros filtrando pela tag de gênero
        const response = await getBookList({ genreTag: genreId, targetCurrency: userCurrency });
        setBooks(response);
      } catch (error) {
        console.error(`Erro ao buscar livros para o gênero ${genreId}:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [genreId, user]);

  if (loading) {
    return (
      <GradientBackground>
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#1599E4" />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <FlatList
            data={books}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BookListItem
                item={item}
                onPress={() => navigation.navigate('BookDetail', { book: item })}
              />
            )}
            contentContainerStyle={styles.listContent}
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
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  }
});