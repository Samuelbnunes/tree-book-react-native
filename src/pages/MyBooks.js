import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TextInput, Text, TouchableOpacity } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import BookListItem from '../components/Book/BookListItem';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';

export default function MyBooks({ navigation }) {
  const { user } = useAuth();
  const { inventory: myBooks, loading, fetchInventory, toggleFavorite } = useInventory();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user) {
        fetchInventory();
      }
    });
    return unsubscribe;
  }, [navigation, user]);

  const filteredBooks = myBooks.filter(book =>
    book && book.title && book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <GradientBackground>
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size={"large"} color={"#1599E4"} />
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
            keyExtractor={(item) => item.productId.toString()}
            renderItem={({ item }) => (
              <BookListItem
                item={item}
                onPress={() => navigation.navigate('BookDetail', { book: { ...item, id: item.productId } })}
                onToggleFavorite={() => toggleFavorite(item.productId)}
              />
            )}
            ListEmptyComponent={
              !loading && (
                <Text style={styles.emptyText}>Você ainda não possui livros.</Text>
              )
            }
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
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 10,
  },
});