import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function BookListItem({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <Image
          source={{ uri: item.image }}
          style={styles.bookImage}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          {item.author && (
            <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
          )}
          {item.price && (
            <Text style={styles.bookPrice}>R$ {parseFloat(item.price).toFixed(2)}</Text>
          )}
        </View>
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
  bookImage: {
    width: 70,
    height: 100,
    borderRadius: 4,
    backgroundColor: '#222',
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
});