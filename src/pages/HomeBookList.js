import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { getBookList, getGenres } from '../services/BookService';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useImage } from '../context/ImageContext';
import GradientBackground from '../components/GradientBackground';
import BookCarousel from '../components/Book/BookCarousel';

export default function BookList({ navigation }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, loading: authLoading } = useAuth();
  const { enrichBooksWithInventoryData } = useInventory();
  const { preloadImages } = useImage();

  useEffect(() => {
    if (!authLoading) {
      fetchSections();
    }
  }, [authLoading, user]);

  async function fetchSections() {
    setLoading(true);
    try {
      const userCurrency = user?.preferedCurrency || 'BRL';

      const genresData = await getGenres();
      setGenres(genresData);

      if (!genresData || genresData.length === 0) {
        setSections([]);
        return;
      }

      const promises = genresData.map(genre =>
        getBookList({ genreTag: genre.id, targetCurrency: userCurrency })
          .then(books => {
            const enrichedBooks = enrichBooksWithInventoryData(books);
            return { title: genre.description, data: enrichedBooks, genreId: genre.id };
          })
      );

      const results = await Promise.all(promises);
      setSections(results.filter(section => section.data.length > 0));

      const allBooks = results.flatMap(section => section.data);
      preloadImages(allBooks);
    } catch (e) {
      console.warn('Erro ao buscar livros', e);
    }
    setLoading(false);
  }

  if ((loading || authLoading) && sections.length === 0) {
    return (
      <GradientBackground>
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator size={'large'} color={'#1599E4'} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.searchBarContainer}>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={24} color="white" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar livros"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.tabsContentContainer} horizontal style={styles.tabsContainer} showsHorizontalScrollIndicator={false}>
            {['E-books', 'Gêneros', 'Lançamentos', 'Promoções'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, tab === 'E-books' && styles.activeTab]}
                onPress={() => {
                  if (tab === 'Gêneros') {
                    navigation.navigate('Genres');
                  } else if (tab === 'Lançamentos' || tab === 'Promoções') {
                    if (genres.length > 0) {
                      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
                      navigation.navigate('AllBookList', { genreId: randomGenre.id, title: randomGenre.description });
                    }
                  } else {
                    console.log(`Clicou em ${tab}`);
                  }
                }}
              >
                <Text style={[styles.tabText, tab === 'E-books' && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView>
            {sections.map(section => (
              <BookCarousel
                key={section.title}
                navigation={navigation}
                title={section.title}
                books={section.data}
                genreId={section.genreId}
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingTop: 10, backgroundColor: 'transparent' },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 15 },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 32,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: { marginRight: 10, color: '#fff' },
  searchInput: { flex: 1, height: '100%', color: '#fff', fontSize: 16 },
  tabsContainer: { flexGrow: 0, height: 48, marginBottom: 15 },
  tabsContentContainer: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 36,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: { backgroundColor: '#1599E4', borderColor: '#1599E4' },
  tabText: { color: '#ccc', fontWeight: '600', fontSize: 14, lineHeight: 18 },
  activeTabText: { color: '#fff' },
});