import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getCoverSource } from '../../services/ImageService';

export default function BookListItem({ item, onPress, onToggleFavorite }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={getCoverSource(item)}
          style={styles.bookImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        {item.author && (
          <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
        )}
      </View>
      <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteIcon}>
        <MaterialIcons
          name={item.isFavorite ? "favorite" : "favorite-border"}
          size={28}
          color={item.isFavorite ? "#E91E63" : "rgba(255, 255, 255, 0.5)"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',

  },
  imageContainer: {
    marginRight: 15,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    color: 'rgba(255, 255, 255)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    marginTop: 4,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    zIndex: 10,
  },
});