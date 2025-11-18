import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GradientBackground from '../components/GradientBackground';

export default function Genres({ navigation }) {
  const genres = [
    'Ficção',
    'Romance',
    'Fantasia',
    'Tecnologia',
    'Negócios',
    'Autoajuda',
    'História',
    'Biografia',
    'Infantil',
    'Poesia',
  ];

  function handleSelect(genre) {
    // Navigate back to BookList and pass the selected genre as a param
    navigation.navigate('BookList', { genre });
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.list}>
            {genres.map((g) => (
              <TouchableOpacity key={g} style={styles.item} onPress={() => handleSelect(g)}>
                <Text style={styles.itemText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  list: { flexDirection: 'row', flexWrap: 'wrap' },
  item: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  itemText: { color: '#fff', fontWeight: '600' },
});
