import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ReviewCard({ review }) {
  // Adiciona uma verificação para garantir que o review e seus dados aninhados existam
  if (!review || !review.username || !review.book) {
    return null; // Não renderiza o card se os dados estiverem incompletos
  }

  return (
    <View style={styles.reviewCard}>
      <View style={styles.avatarContainer}>
        {review.userImage ? (
          <Image source={{ uri: review.userImage }} style={styles.avatarImage} />
        ) : (
          <MaterialIcons name="account-circle" size={48} color="rgba(255, 255, 255, 0.5)" />
        )}
      </View>
      <View style={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewUser}>{review.username}</Text>
          <Text style={styles.reviewDate}>{new Date(review.postDate).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.reviewTitle} numberOfLines={1}>{review.title}</Text>
        <Text style={styles.reviewBookTitle} numberOfLines={1}>{review.book.title}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <MaterialIcons key={i} name="star" size={16} color={i < review.grade ? '#FFD700' : '#555'} />
          ))}
        </View>
        <Text style={styles.reviewText}>{review.comment}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24, // Metade da largura/altura para fazer um círculo
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Cor de fundo para o placeholder
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewUser: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewDate: {
    color: '#999',
    fontSize: 12,
  },
  reviewTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  reviewBookTitle: {
    color: '#ccc',
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
});