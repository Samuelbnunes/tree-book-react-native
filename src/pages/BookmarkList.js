import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useBookmark } from '../context/BookmarkContext';
import ButtonPrimary from '../components/ButtonPrimary';
import ManageBookmarksModal from '../components/ManageBookmarksModal';

const BookmarkItem = React.memo(({ item, onEdit, onDelete, onSelect, isSelected, selectionMode }) => {
  return (
    <TouchableOpacity
      style={[styles.bookmarkItem, isSelected && styles.bookmarkItemSelected]}
      onPress={() => onSelect(item.id)}
      onLongPress={() => onSelect(item.id)}
    >
      {selectionMode && (
        <MaterialIcons name={isSelected ? 'check-box' : 'check-box-outline-blank'} size={24} color="white" style={styles.checkbox} />
      )}
      <View style={[styles.bookmarkTag, { backgroundColor: item.hexColor || '#333' }]}>
        <Text style={styles.bookmarkText}>{`#${item.id} - ${item.description}`}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionIcon}>
          <MaterialIcons name="edit" size={24} color="#1599E4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.actionIcon}>
          <MaterialIcons name="delete-outline" size={24} color="#e91e39ff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

export default function BookmarkList({ navigation }) {
  const { bookmarks, deleteBookmark, deleteMultipleBookmarks } = useBookmark();
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const selectionMode = selectedIds.size > 0;
  const areAllSelected = selectedIds.size === bookmarks.length && bookmarks.length > 0;

  const handleOpenEditModal = (bookmark) => {
    setEditingBookmark(bookmark);
    setCreateModalVisible(true);
  };

  const handleSelection = (id) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleToggleSelectAll = () => {
    if (areAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(bookmarks.map(b => b.id)));
    }
  };

  const handleDeleteSelected = () => {
    deleteMultipleBookmarks(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <FlatList
            data={bookmarks}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={({ item }) => (
              <BookmarkItem
                item={item}
                onEdit={handleOpenEditModal}
                onDelete={deleteBookmark}
                onSelect={handleSelection}
                isSelected={selectedIds.has(item.id)}
                selectionMode={selectionMode}
              />
            )}
            ListHeaderComponent={
              selectionMode && (
                <View style={styles.listHeader}>
                  <TouchableOpacity style={styles.headerButton} onPress={handleToggleSelectAll}>
                    <MaterialIcons name={areAllSelected ? 'check-box' : 'check-box-outline-blank'} size={24} color="white" />
                    <Text style={styles.headerButtonText}>Selecionar Tudo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerButton} onPress={handleDeleteSelected}>
                    <MaterialIcons name="delete-outline" size={24} color="#e91e39ff" />
                  </TouchableOpacity>
                </View>
              )
            }
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum marcador existente.</Text>}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.footer}>
            <ButtonPrimary title="Novo Marcador" onPress={() => setCreateModalVisible(true)} />
          </View>
        </View>
        <ManageBookmarksModal
          visible={isCreateModalVisible || !!editingBookmark}
          onClose={() => {
            setCreateModalVisible(false);
            setEditingBookmark(null);
          }}
          bookmarkToEdit={editingBookmark}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  bookmarkItemSelected: {
    backgroundColor: 'rgba(21, 153, 228, 0.2)',
    borderColor: '#1599E4',
  },
  bookmarkTag: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  bookmarkText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    paddingTop: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  actionIcon: {
    padding: 5,
  },
  checkbox: {
    marginRight: 15,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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