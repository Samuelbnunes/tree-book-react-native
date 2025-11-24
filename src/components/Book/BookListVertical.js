import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { getCoverSource } from '../../services/ImageService';

const { width } = Dimensions.get('window');
const numColumns = 3;
const itemMargin = 10;
const itemWidth = (width - (itemMargin * (numColumns + 1))) / numColumns;
const itemHeight = itemWidth * 1.5;

const BookItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Image source={getCoverSource(item)} style={styles.bookCover} />
    <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
  </TouchableOpacity>
);

export default function BookListVertical({ books, onBookPress }) {
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookItem item={item} onPress={() => onBookPress(item)} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: itemMargin / 2,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  itemContainer: {
    width: itemWidth,
    margin: itemMargin / 2,
    alignItems: 'center',
  },
  bookCover: {
    width: itemWidth,
    height: itemHeight,
    borderRadius: 8,
    backgroundColor: '#222',
    marginBottom: 8,
  },
  bookTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
});