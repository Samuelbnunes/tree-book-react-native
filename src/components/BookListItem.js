import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getCoverSource } from '../services/ImageService';

export default function BookListItem({ item, onPress, onToggleFavorite, onSelect, isSelected, selectionMode }) {

  const handlePress = () => {
    if (selectionMode) {
      onSelect();
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} onLongPress={onSelect} activeOpacity={0.8} style={[styles.card, isSelected && styles.cardSelected]}>
      {selectionMode && <MaterialIcons name={isSelected ? 'check-circle' : 'radio-button-unchecked'} size={24} color={isSelected ? '#1599E4' : '#fff'} style={styles.checkbox} />}
      <View style={styles.mainContent}>
        <Image
          source={getCoverSource(item)}
          style={styles.bookImage}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          {item.author && (
            <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
          )}
          {item.bookmarksList && item.bookmarksList.length > 0 && (
            <View style={styles.bookmarksContainer}>
              {item.bookmarksList.map(bookmark => (
                <View key={bookmark.id} style={[styles.bookmarkTag, { backgroundColor: bookmark.hexColor || '#555' }]}>
                  <Text style={styles.bookmarkText}>{bookmark.description}</Text>
                </View>
              ))}
            </View>
          )}
          {item.price && (
            <Text style={styles.bookPrice}>R$ {parseFloat(item.price).toFixed(2)}</Text>
          )}
        </View>
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
          <MaterialIcons
            name={item.isFavorite ? "favorite" : "favorite-border"}
            size={28}
            color={item.isFavorite ? "#E91E63" : "#fff"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardSelected: {
    backgroundColor: 'rgba(21, 153, 228, 0.15)',
    borderColor: '#1599E4',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookImage: {
    width: 70,
    height: 100,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  bookTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  bookPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  bookmarksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  bookmarkTag: {
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  bookmarkText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    paddingLeft: 15, // Espaçamento para não ficar colado no texto
    justifyContent: 'center',
  },
  checkbox: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
});