import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import { getBookList } from '../services/BookService';
import { useAuth } from '../context/AuthContext';
import BookListVertical from '../components/Book/BookListVertical';

export default function GenersList({ route, navigation }) {
  const genreId = route.params?.genreId;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        let response;
        const userCurrency = user?.preferedCurrency || 'BRL';

        if (genreId) {
          response = await getBookList({ genreTag: genreId, targetCurrency: userCurrency });
        } else {
          response = await getBookList();
        }
        setBooks(response);
      } catch (error) {
        console.error(`Erro ao buscar livros:`, error);
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
          <BookListVertical
            books={books}
            onBookPress={(book) => navigation.navigate('BookDetail', { book })}
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
  }
});