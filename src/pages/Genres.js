import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import { getGenres } from '../services/BookService';

export default function Genres({ navigation }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (error) {
        console.error("Falha ao buscar gêneros:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGenres();
  }, []);

  function handleSelect(genre) { // genre is an object like { id, description }
    // Navega para a tela AllBookList, passando o ID e o título do gênero
    navigation.navigate('AllBookList', { genreId: genre.id, title: genre.description });
  }

  if (loading) {
    return (
      <GradientBackground>
        <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#1599E4" />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.list}>
            {genres.map((genre) => (
              <TouchableOpacity key={genre.id} style={styles.item} onPress={() => handleSelect(genre)}>
                <Text style={styles.itemText}>{genre.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  list: { flexDirection: 'row', flexWrap: 'wrap' },
  item: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  itemText: { color: '#fff', fontWeight: '600' },
});
