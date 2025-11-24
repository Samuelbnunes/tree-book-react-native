import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getCoverSource } from '../services/ImageService';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <MaterialIcons
        key={i}
        name={i <= rating ? 'star' : 'star-border'}
        size={20}
        color="#FFD700"
      />
    );
  }
  return <View style={styles.starContainer}>{stars}</View>;
};

export default function ReviewCard({ review }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={getCoverSource(review.book)} style={styles.bookImage} />
        <View style={styles.headerText}>
          <Text style={styles.bookTitle}>{review.book.title}</Text>
          <Text style={styles.userName}>Avaliado por: {review.user.name}</Text>
          <StarRating rating={review.rating} />
        </View>
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bookImage: {
    width: 60,
    height: 90,
    resizeMode: 'contain',
    borderRadius: 4,
  },
  headerText: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  bookTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  reviewText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
});