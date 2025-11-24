import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, Image, ActivityIndicator } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import ReviewCard from '../components/ReviewCard';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getAllReviews } from '../services/ReviewService';

export default function Community() {
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lista de títulos de livros mocados para aleatorização
  const mockedBookTitles = [
    "O Guia do Mochileiro das Galáxias",
    "A Arte da Guerra",
    "1984",
    "O Senhor dos Anéis",
    "Fahrenheit 451",
    "Duna",
  ];
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const reviewsData = await getAllReviews();

        if (reviewsData.length > 0) {
          // Busca fotos de usuários aleatórios, uma para cada avaliação
          const userImagesResponse = await fetch(`https://randomuser.me/api/?results=${reviewsData.length}`);
          const userImagesData = await userImagesResponse.json();

          // Combina os dados, atribuindo um livro aleatório e uma imagem de usuário a cada avaliação
          const reviewsWithDetails = reviewsData.map((review, index) => ({
            ...review,
            userImage: userImagesData.results[index]?.picture?.large,
            // Atribui um livro aleatório da lista mocada
            book: { title: mockedBookTitles[Math.floor(Math.random() * mockedBookTitles.length)] },
          }));
          setReviews(reviewsWithDetails);
        } else {
          setReviews([]);
        }

      } catch (err) {
        setError("Não foi possível carregar as avaliações.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filtra as avaliações com base na query de busca
  const filteredReviews = reviews.filter(review => {
    const query = searchQuery.toLowerCase();
    return (
      review.username.toLowerCase().includes(query) ||
      review.title.toLowerCase().includes(query) ||
      review.comment.toLowerCase().includes(query)
    );
  });

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="white" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar em avaliações..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#1599E4" style={{ marginTop: 50 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <ScrollView>
              {filteredReviews.length > 0
                ? filteredReviews.map((review, index) => <ReviewCard key={`${review.postDate}-${review.username}-${index}`} review={review} />)
                : (
                  <Text style={styles.emptyText}>Nenhuma avaliação na comunidade ainda.</Text>
                )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
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
    marginBottom: 20,
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
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});