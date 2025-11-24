import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getCoverSource } from "../services/ImageService";

export default function BookCard({ book, onPress, onFavorite, isFavorite }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <Image source={getCoverSource(book)} style={styles.image} />
        <Text style={styles.name}>{book.title}</Text>
      </TouchableOpacity>
      {onFavorite && (
        <TouchableOpacity onPress={onFavorite} style={styles.favoriteButton}>
          <MaterialIcons name={isFavorite ? "favorite" : "favorite-border"} size={30} color={isFavorite ? "#E91E63" : "#fff"} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    zIndex: 1,
  },
  image: {
    width: 100,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
  },
});