// app/homeScreen.tsx
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

const destinations = [
  {
    id: '1',
    title: 'Rara Lake',
    description: 'Remote, serene, and untouched beauty of Nepal.',
    image: require('../assets/images/rara.jpg'),
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Tansen Palpa',
    description: 'A hidden cultural gem with stunning views.',
    image: require('../assets/images/palpa.jpg'),
    rating: 4.6,
  },
  {
    id: '3',
    title: 'Kalinchowk',
    description: 'Snow-capped hills and panoramic Himalayan views.',
    image: require('../assets/images/kalinchowk.jpg'),
    rating: 4.7,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore Nepal</Text>

      {/* Underrated Destinations */}
      <Text style={styles.subHeading}>Underrated Destinations</Text>
      <FlatList
        data={destinations}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} contentFit="cover" />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Pressable
              style={styles.detailsButton}
              onPress={() => router.push('/location-details')}
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2E6B4F',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  cardList: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginRight: 15,
    width: 250,
    padding: 10,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1A3D2A',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  rating: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },
  detailsButton: {
    marginTop: 8,
    backgroundColor: '#2E6B4F',
    padding: 8,
    borderRadius: 5,
  },
  detailsButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
});
