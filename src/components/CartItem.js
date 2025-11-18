import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function CartItem({ item, isSelected, onSelect }) {
  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
      <View style={[styles.card, isSelected && styles.cardSelected]}>
        <MaterialIcons
          name={isSelected ? 'check-box' : 'check-box-outline-blank'}
          size={28}
          color={isSelected ? '#1599E4' : 'white'}
          style={styles.checkbox}
        />
        <Image source={{ uri: item.image }} style={styles.bookImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
        </View>
        <Text style={styles.bookPrice}>R$ {item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#1599E4', // Borda azul para item selecionado
  },
  checkbox: {
    marginRight: 15,
  },
  bookImage: {
    width: 60,
    height: 90,
    resizeMode: 'contain',
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
    fontSize: 12,
    marginTop: 4,
  },
  bookPrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});