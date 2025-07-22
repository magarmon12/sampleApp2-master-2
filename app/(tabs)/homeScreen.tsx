// app/(tabs)/homeScreen.tsx
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

// Section data
const topPlaces = [
  { id: 'kalinchowk', title: 'Kalinchowk', image: require('../../assets/images/HomeKalinchowk.jpg') },
  { id: 'pokhara',    title: 'Pokhara Lakeside', image: require('../../assets/images/HomePokhara.jpg') },
  { id: 'nagarkot',   title: 'Nagarkot Sunrise', image: require('../../assets/images/HomeNagarkot.jpg') },
];
const adventureDestinations = [
  { id: 'bungee',    title: 'Bungee Jumping',      image: require('../../assets/images/HomeBungee.jpg') },
  { id: 'zipline',   title: 'Zip Lining',          image: require('../../assets/images/HomeZipline.jpg') },
  { id: 'skydiving', title: 'Skydiving',          image: require('../../assets/images/HomeSkydiving.jpg') },
  { id: 'rafting',   title: 'White Water Rafting', image: require('../../assets/images/Homerafting.jpg') },
];
const cultureDestinations = [
  { id: 'Pashupatinath',    title: 'Pashupatinath temple',         image: require('../../assets/images/HomePashupatinath.jpg') },
  { id: 'Bouddha',    title: 'Bouddhanath Stupa',        image: require('../../assets/images/HomeBouddha.jpg') },
  { id: 'Bhaktapur',   title: 'Art Bhaktapur',         image: require('../../assets/images/HomeBhaktapur.jpg') },
  { id: 'Lumbini',  title: 'Lumbini ',       image: require('../../assets/images/HomeLumbini.jpg') },
];

type Destination = {
  id: string;
  title: string;
  image: any;
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  // Local state
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Responsive card dimensions
  const MAX_CARD_WIDTH = 280;
  const baseCardWidth = width * 0.7;
  const cardWidth = Math.min(MAX_CARD_WIDTH, baseCardWidth);
  const cardHeight = cardWidth * 0.75;
  const cardMargin = 16;

  // Navigate
  const goToDestination = (id: string) => {
    router.push(`destination/${id}` as any);
  };

  // Toggle favorites
  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Render single card
  const renderCard = ({ item }: { item: Destination }) => (
    <View style={[styles.card, { width: cardWidth, marginRight: cardMargin }]}>  
      <View style={styles.imageWrapper}>
        <Pressable onPress={() => goToDestination(item.id)}>
          <Image
            source={item.image}
            style={{ width: cardWidth, height: cardHeight }}
            resizeMode="cover"
          />
        </Pressable>
        <Pressable
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <IconSymbol
            name={favorites.includes(item.id) ? 'heart.fill' : 'heart'}
            size={24}
            color={Colors[colorScheme ?? 'light'].tint}
          />
        </Pressable>
      </View>
      <Pressable onPress={() => goToDestination(item.id)} style={styles.titleButton}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </Pressable>
    </View>
  );

  // Generic filter function for destinations
  const filterData = (data: Destination[]): Destination[] =>
    data.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* Cover with search & text */}
        <View style={styles.coverContainer}>
          <Image
            source={require('../../assets/images/kalinchowk.jpg')}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.coverOverlay}>
            <View style={styles.searchBox}>
              <IconSymbol name="magnifyingglass" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search destinations"
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.overlayTextContainer}>
              <Text style={styles.headline}>Welcome to Our App!</Text>
              <Text style={styles.subheading}>Discover amazing features</Text>
            </View>
          </View>
        </View>

        {/* Top Places */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Top Places</Text>
          <FlatList
            data={filterData(topPlaces)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={renderCard}
            keyExtractor={item => item.id}
          />
        </View>

        {/* Adventure */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Adventure</Text>
          <FlatList
            data={filterData(adventureDestinations)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={renderCard}
            keyExtractor={item => item.id}
          />
        </View>

        {/* Culture */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Culture</Text>
          <FlatList
            data={filterData(cultureDestinations)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={renderCard}
            keyExtractor={item => item.id}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f2f7' },

  // Cover
  coverContainer: { position: 'relative', width: '100%', aspectRatio: 2.5 },
  coverImage: { width: '100%', height: '100%' },
  coverOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', padding: 16, justifyContent: 'space-between'
  },
  searchBox: {
    flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  overlayTextContainer: { alignItems: 'center', marginBottom: 16 },
  headline: { fontSize: 28, fontWeight: '700', color: '#fff' },
  subheading: { fontSize: 16, color: '#fff', marginTop: 4 },

  // Sections
  sectionContainer: { marginTop: 24 },
  sectionHeader: { fontSize: 24, fontWeight: '700', color: '#333', paddingHorizontal: 16, marginBottom: 12 },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
  imageWrapper: { position: 'relative' },
  favoriteButton: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: 4, zIndex: 10
  },
  titleButton: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
});