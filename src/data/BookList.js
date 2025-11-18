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

import { getBookList } from '../services/bookService';
import GradientBackground from '../components/GradientBackground';
import BookCarousel from '../components/BookCarousel';

export default function BookList({ navigation }) {
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await getBookList();
      setBookList(response);
    } catch (e) {
      console.warn('Erro ao buscar livros', e);
    }
    setLoading(false);
  }

  if (loading && bookList.length === 0) {
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
              />
            </View>
          </View>

          <ScrollView horizontal style={styles.tabsContainer} showsHorizontalScrollIndicator={false}>
            {['E-books', 'Gêneros', 'Os mais vendidos', 'Novidades'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, tab === 'E-books' && styles.activeTab]}
                onPress={() => {
                  if (tab === 'Gêneros') {
                    navigation.navigate('Genres');
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
            <BookCarousel navigation={navigation} />
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
  tabsContainer: { height: 48, marginBottom: 5, paddingLeft: 15 },
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