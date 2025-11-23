import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function CarouselBookCard({ item, onPress }) {
  return (
    <TouchableOpacity style={carouselStyles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={carouselStyles.bookContainer}>
        <BookImage source={item.image} />
        <View style={carouselStyles.textContainerBelow}>
          <Text style={carouselStyles.title} numberOfLines={2}>{item.title}</Text>
          {item.author && (
            <Text style={carouselStyles.author} numberOfLines={1} ellipsizeMode="tail">{item.author}</Text>
          )}
          {item.price ? <Text style={carouselStyles.price}>R$ {parseFloat(item.price).toFixed(2)}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Small helper to render image with fixed height
function BookImage({ source }) {
  const imgSource = typeof source === 'string' ? { uri: source } : source;
  return <Image source={imgSource} style={carouselStyles.image} resizeMode="cover" />;
}

// Componente Principal do Carrossel
export default function BookCarousel({ navigation, title, books, genreId }) {
  if (!books || books.length === 0) {
    return null; // Não renderiza nada se não houver livros
  }
  
  return (
    <View style={carouselStyles.sectionContainer}>
      <View style={carouselStyles.header}>
        <Text style={carouselStyles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllBookList', { title: title, genreId: genreId })}>
          <MaterialIcons name="arrow-forward" size={24} color="#1599E4" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={carouselStyles.itemContainer}>
            <CarouselBookCard item={item} onPress={() => navigation.navigate('BookDetail', { book: item })} />
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 15 }}
      />
    </View>
  );
}

const carouselStyles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingTop: 10,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemContainer: {
    width: 120,
    marginRight: 15,
  },
  bookContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 6,
    backgroundColor: '#222',
  },
  textContainerBelow: {
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 6,
  },
  title: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'left',
    fontWeight: '600',
    lineHeight: 18,
  },
  author: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'left',
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ccc', // Adaptado para Dark Mode
    marginTop: 4,
  },
  card: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
  }
});
