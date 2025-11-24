import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import BookListItem from '../components/BookListItem';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';

export default function MyBooks({ navigation }) {
  const { user } = useAuth();
  const { inventory: myBooks, loading, fetchInventory, toggleFavorite } = useInventory();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookIds, setSelectedBookIds] = useState(new Set());

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user) {
        fetchInventory();
      }
    });
    return unsubscribe;
  }, [navigation, user]);

  const filteredBooks = myBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectionMode = selectedBookIds.size > 0;
  const areAllSelected = selectedBookIds.size === filteredBooks.length && filteredBooks.length > 0;

  const handleSelection = (bookId) => {
    const newSelectedIds = new Set(selectedBookIds);
    if (newSelectedIds.has(bookId)) {
      newSelectedIds.delete(bookId);
    } else {
      newSelectedIds.add(bookId);
    }
    setSelectedBookIds(newSelectedIds);
  };

  const handleToggleSelectAll = () => {
    if (areAllSelected) {
      setSelectedBookIds(new Set());
    } else {
      setSelectedBookIds(new Set(filteredBooks.map(b => b.id)));
    }
  };

  // TODO: Implementar a lógica para adicionar marcadores aos livros selecionados
  const handleAddBookmarksToSelected = () => { };

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

          <TouchableOpacity style={styles.manageBookmarksButton} onPress={() => navigation.navigate('BookmarkList')}>
            <MaterialIcons name="bookmark-border" size={20} color="#1599E4" />
            <Text style={styles.manageBookmarksText}>Marcadores</Text>
          </TouchableOpacity>

          {selectionMode && (
            <View style={styles.selectionHeader}>
              <TouchableOpacity style={styles.headerButton} onPress={handleToggleSelectAll}>
                <MaterialIcons name={areAllSelected ? 'check-box' : 'check-box-outline-blank'} size={24} color="white" />
                <Text style={styles.headerButtonText}>Selecionar Tudo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleAddBookmarksToSelected}>
                <MaterialIcons name="bookmark-add" size={24} color="#1599E4" />
                <Text style={styles.headerButtonText}>Adicionar Marcadores</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BookListItem
                item={item}
                selectionMode={selectionMode}
                isSelected={selectedBookIds.has(item.id)}
                onSelect={() => handleSelection(item.id)}
                onPress={() => navigation.navigate('BookDetail', { book: item })}
                onToggleFavorite={() => toggleFavorite(item.id)}
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
  manageBookmarksButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(21, 153, 228, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(21, 153, 228, 0.3)',
  },
  manageBookmarksText: {
    color: '#1599E4',
    marginLeft: 8,
    fontWeight: 'bold',
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
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonText: {
    color: 'white',
    marginLeft: 8,
  },
});