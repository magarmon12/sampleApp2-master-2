// app/(tabs)/homeScreen.tsx
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
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
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

import { useAppwriteUser } from '@/hooks/useAppwriteUser';
import {
  getFavoriteByUserPlace,
  listFavoritesByUser,
  removeFavoriteById,
  toggleFavoriteApi
} from '@/lib/favorites';

/* ----------------------------- Local data ----------------------------- */
type Place = { id: string; title: string; image: any; location?: string };
type Festival = { id: string; name: string; date: string; city: string };
type Itinerary = {
  id: string;
  title: string;
  days: number;
  highlights: string[];
  cover: any;
};

const TOP_PLACES: Place[] = [
  {
    id: 'kalinchowk',
    title: 'Kalinchowk',
    image: require('../assets/images/HomeKalinchowk.jpg'),
    location: 'Dolakha',
  },
  {
    id: 'pokhara',
    title: 'Pokhara Lakeside',
    image: require('../assets/images/HomePokhara.jpg'),
    location: 'Pokhara',
  },
  {
    id: 'nagarkot',
    title: 'Nagarkot Sunrise',
    image: require('../assets/images/HomeNagarkot.jpg'),
    location: 'Nagarkot',
  },
];

const ADVENTURE: Place[] = [
  {
    id: 'bungee',
    title: 'Bungee Jumping',
    image: require('../assets/images/HomeBungee.jpg'),
    location: 'Kushma',
  },
  {
    id: 'zipline',
    title: 'Zip Lining',
    image: require('../assets/images/HomeZipline.jpg'),
    location: 'Pokhara',
  },
  {
    id: 'skydiving',
    title: 'Skydiving',
    image: require('../assets/images/HomeSkydiving.jpg'),
    location: 'Pokhara',
  },
  {
    id: 'rafting',
    title: 'White Water Rafting',
    image: require('../assets/images/Homerafting.jpg'),
    location: 'Trishuli',
  },
];

const CULTURE: Place[] = [
  {
    id: 'pashupatinath',
    title: 'Pashupatinath Temple',
    image: require('../assets/images/HomePashupatinath.jpg'),
    location: 'Kathmandu',
  },
  {
    id: 'bouddha',
    title: 'Bouddhanath Stupa',
    image: require('../assets/images/HomeBouddha.jpg'),
    location: 'Kathmandu',
  },
  {
    id: 'bhaktapur',
    title: 'Art Bhaktapur',
    image: require('../assets/images/HomeBhaktapur.jpg'),
    location: 'Bhaktapur',
  },
  {
    id: 'lumbini',
    title: 'Lumbini',
    image: require('../assets/images/HomeLumbini.jpg'),
    location: 'Rupandehi',
  },
];

const FESTIVALS: Festival[] = [
  { id: 'dashain', name: 'Dashain', date: 'Oct 10', city: 'Kathmandu' },
  { id: 'tihar', name: 'Tihar', date: 'Nov 3', city: 'Bhaktapur' },
  { id: 'holi', name: 'Holi', date: 'Mar 22', city: 'Pokhara' },
  { id: 'losar', name: 'Losar', date: 'Feb 9', city: 'Boudha' },
];

const ITINERARIES: Itinerary[] = [
  {
    id: 'ktm3',
    title: '3-Day Kathmandu Heritage',
    days: 3,
    highlights: ['Pashupatinath', 'Boudhanath', 'Bhaktapur'],
    cover: require('../assets/images/HomeBhaktapur.jpg'),
  },
  {
    id: 'pkr5',
    title: '5-Day Pokhara & Annapurna',
    days: 5,
    highlights: ['Phewa Lake', 'Sarangkot', 'Australian Camp'],
    cover: require('../assets/images/HomePokhara.jpg'),
  },
  {
    id: 'east4',
    title: '4-Day Kalinchowk & Dolakha',
    days: 4,
    highlights: ['Kalinchowk', 'Local Temples', 'Snow Walks'],
    cover: require('../assets/images/HomeKalinchowk.jpg'),
  },
];

const CAROUSEL_SLIDES: Place[] = [
  {
    id: 'pokhara',
    title: 'Sunrise over Phewa',
    image: require('../assets/images/HomePokhara.jpg'),
    location: 'Pokhara',
  },
  {
    id: 'kalinchowk',
    title: 'Snowy Kalinchowk',
    image: require('../assets/images/HomeKalinchowk.jpg'),
    location: 'Dolakha',
  },
  {
    id: 'bhaktapur',
    title: 'Bhaktapur Heritage',
    image: require('../assets/images/HomeBhaktapur.jpg'),
    location: 'Bhaktapur',
  },
];

/* --------------------------------- Screen -------------------------------- */
export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const { user } = useAppwriteUser();

  const [search, setSearch] = useState('');
  const [favs, setFavs] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  // Load user's existing favourites
  useEffect(() => {
    (async () => {
      try {
        if (!user) {
          setFavs([]);
          return;
        }
        const docs = await listFavoritesByUser(user.$id);
        setFavs(docs.map((d) => d.placeId));
      } catch (e: any) {
        console.warn('Seed favs failed:', e?.message ?? e);
      }
    })();
  }, [user]);

  const cardW = Math.min(280, width * 0.7);
  const cardH = cardW * 0.72;

  const filterPlaces = useCallback(
    (list: Place[]) =>
      list.filter((p) =>
        p.title.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [search]
  );

  const toggleFav = async (place: Place) => {
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to save favourites.');
      return;
    }
    if (busy) return;
    setBusy(place.id);

    try {
      const existing = await getFavoriteByUserPlace(user.$id, place.id);
      if (existing) {
        setFavs((prev) => prev.filter((x) => x !== place.id)); // optimistic
        await removeFavoriteById(existing.$id);
      } else {
        setFavs((prev) => (prev.includes(place.id) ? prev : [...prev, place.id]));
        // IMPORTANT: only send userId & placeId (no 'title')
        await toggleFavoriteApi({ userId: user.$id, placeId: place.id });
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Could not update favourite.');
    } finally {
      setBusy(null);
    }
  };

  const tint = Colors[colorScheme ?? 'light'].tint;

  const openDetails = (id: string) =>
    router.push({ pathname: '/location-details', params: { id } });
  const goDiscover = () => router.push('/(tabs)/Discover');
  const goFavourites = () => router.push('/(tabs)/Favourites');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* TOP CAROUSEL */}
        <View style={{ paddingTop: 8, marginBottom: 8 }}>
          <TopCarousel
            slides={CAROUSEL_SLIDES}
            width={width}
            isFav={(id) => favs.includes(id)}
            onToggleFav={(id) => {
              const place = CAROUSEL_SLIDES.find((p) => p.id === id);
              if (place) toggleFav(place);
            }}
            onOpen={openDetails}
            tint={tint}
          />
        </View>

        {/* SEARCH + QUICK */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" size={18} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search places, treks, or festivals"
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
          </View>

          <View style={styles.quickRow}>
            <QuickAction
              icon="map"
              label="Itinerary"
              onPress={() => router.push('/itineraries' as any)}
            />
            <QuickAction
              icon="sparkles"
              label="Festivals"
              onPress={() => router.push('/festivals' as any)}
            />
            <QuickAction
              icon="mappin.and.ellipse"
              label="Top Places"
              onPress={goDiscover}
            />
            <QuickAction
              icon="heart"
              label="Favourites"
              onPress={goFavourites}
            />
          </View>
        </View>

        {/* TOP PLACES */}
        <SectionHeader title="Top Places" actionLabel="View all" onAction={goDiscover} />
        <FlatList
          data={filterPlaces(TOP_PLACES)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <PlaceCard
              item={item}
              width={cardW}
              height={cardH}
              isFav={favs.includes(item.id)}
              onFav={() => toggleFav(item)}
              onOpen={() => openDetails(item.id)}
              tint={tint}
            />
          )}
        />

        {/* ADVENTURE */}
        <SectionHeader title="Adventure" actionLabel="Browse" onAction={goDiscover} />
        <FlatList
          data={filterPlaces(ADVENTURE)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <PlaceCard
              item={item}
              width={cardW}
              height={cardH}
              isFav={favs.includes(item.id)}
              onFav={() => toggleFav(item)}
              onOpen={() => openDetails(item.id)}
              tint={tint}
            />
          )}
        />

        {/* CULTURE */}
        <SectionHeader title="Culture" actionLabel="Browse" onAction={goDiscover} />
        <FlatList
          data={filterPlaces(CULTURE)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <PlaceCard
              item={item}
              width={cardW}
              height={cardH}
              isFav={favs.includes(item.id)}
              onFav={() => toggleFav(item)}
              onOpen={() => openDetails(item.id)}
              tint={tint}
            />
          )}
        />

        {/* FESTIVAL CALENDAR */}
        <SectionHeader
          title="Festival Calendar"
          actionLabel="See calendar"
          onAction={() => router.push('/festivals' as any)}
        />
        <FlatList
          data={FESTIVALS}
          keyExtractor={(f) => f.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/festivals/${item.id}` as any)}>
              <FestivalPill festival={item} />
            </Pressable>
          )}
        />

        {/* MINI ITINERARIES */}
        <SectionHeader
          title="Mini Itineraries"
          actionLabel="Browse itineraries"
          onAction={() => router.push('/itineraries')}
        />
        <View style={styles.itineraryList}>
          {ITINERARIES.map((it) => (
            <Pressable
              key={it.id}
              onPress={() =>
                router.push({ pathname: '/itineraries/[id]', params: { id: it.id } })
              }
              style={styles.itineraryCard}
            >
              <Image source={it.cover} style={styles.itineraryCover} />
              <View style={styles.itineraryInfo}>
                <Text style={styles.itineraryTitle}>{it.title}</Text>
                <Text style={styles.itineraryMeta}>
                  {it.days} days • {it.highlights[0]}
                </Text>
                <View style={styles.itineraryChips}>
                  {it.highlights.slice(0, 3).map((h, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{h}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <IconSymbol name="chevron.right" size={18} color="#9ca3af" />
            </Pressable>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Ready to plan your trip?</Text>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: tint }]}
            onPress={() => router.push('/itineraries' as any)}
          >
            <Text style={styles.primaryBtnText}>Build My Itinerary</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------ Carousel ------------------------------ */

function TopCarousel({
  slides,
  width,
  isFav,
  onToggleFav,
  onOpen,
  tint,
}: {
  slides: Place[];
  width: number;
  isFav: (id: string) => boolean;
  onToggleFav: (id: string) => void;
  onOpen: (id: string) => void;
  tint: string;
}) {
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const sliderW = width;
  const sliderH = Math.max(180, Math.min(260, width * 0.55));

  return (
    <Carousel
      ref={carouselRef}
      width={sliderW}
      height={sliderH}
      data={slides}
      loop
      autoPlay
      autoPlayInterval={3000}
      pagingEnabled
      scrollAnimationDuration={700}
      renderItem={({ item, animationValue }) => {
        const style = useAnimatedStyle(() => ({
          transform: [
            {
              scale: interpolate(
                animationValue.value,
                [-1, 0, 1],
                [0.92, 1, 0.92],
                Extrapolation.CLAMP
              ),
            },
          ],
        }));

        return (
          <Animated.View style={[styles.slideCard, style]}>
            <Pressable
              onPress={() => onOpen(item.id)}
              style={{ flex: 1, borderRadius: 16, overflow: 'hidden' }}
            >
              <Image source={item.image} style={{ width: '100%', height: '100%' }} />
              <View style={styles.slideOverlay} />
              <View style={styles.slideContent}>
                <Text style={styles.slideTitle}>{item.title}</Text>
                {!!item.location && (
                  <View style={styles.slideLocRow}>
                    <IconSymbol name="mappin.and.ellipse" size={12} color="#fff" />
                    <Text style={styles.slideLocText}>{item.location}</Text>
                  </View>
                )}
              </View>
            </Pressable>

            <Pressable onPress={() => onToggleFav(item.id)} style={styles.slideHeart} hitSlop={8}>
              <IconSymbol
                name={isFav(item.id) ? 'heart.fill' : 'heart'}
                size={22}
                color={isFav(item.id) ? tint : '#111827'}
              />
            </Pressable>
          </Animated.View>
        );
      }}
    />
  );
}

/* ------------------------------ Reusables ------------------------------ */

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.quick} onPress={onPress}>
      <View style={styles.quickIconWrap}>
        <IconSymbol name={icon} size={18} color="#1f2937" />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

function PlaceCard({
  item,
  width,
  height,
  isFav,
  onFav,
  onOpen,
  tint,
}: {
  item: Place;
  width: number;
  height: number;
  isFav: boolean;
  onFav: () => void;
  onOpen: () => void;
  tint: string;
}) {
  return (
    <View style={[styles.placeCard, { width }]}>
      <Pressable onPress={onOpen} style={{ borderRadius: 14, overflow: 'hidden' }}>
        <Image source={item.image} style={{ width, height }} />
        <View style={styles.placeGradient} />
        <View style={styles.placeTitleRow}>
          <Text style={styles.placeTitleText}>{item.title}</Text>
          {item.location ? (
            <View style={styles.placeLocRow}>
              <IconSymbol name="mappin.and.ellipse" size={12} color="#fff" />
              <Text style={styles.placeLocText}>{item.location}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>

      <Pressable onPress={onFav} style={styles.heartBtn} hitSlop={8}>
        <IconSymbol
          name={isFav ? 'heart.fill' : 'heart'}
          size={22}
          color={isFav ? tint : '#111827'}
        />
      </Pressable>
    </View>
  );
}

function FestivalPill({ festival }: { festival: Festival }) {
  return (
    <View style={styles.festivalPill}>
      <View style={styles.festivalDate}>
        <IconSymbol name="calendar" size={14} color="#111827" />
        <Text style={styles.festivalDateText}>{festival.date}</Text>
      </View>
      <Text style={styles.festivalName}>{festival.name}</Text>
      <Text style={styles.festivalCity}>{festival.city}</Text>
    </View>
  );
}

/* -------------------------------- Styles ------------------------------- */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollBody: { paddingBottom: 48 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchInput: { flex: 1, paddingVertical: 0, color: '#111827' },

  quickRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  quick: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickIconWrap: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 999 },
  quickLabel: { fontSize: 12, fontWeight: '600', color: '#111827' },

  sectionHeaderRow: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  sectionAction: { color: '#2563eb', fontWeight: '700' },

  slideCard: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  slideOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  slideContent: { position: 'absolute', left: 14, right: 14, bottom: 14 },
  slideTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  slideLocRow: { marginTop: 6, flexDirection: 'row', gap: 6, alignItems: 'center' },
  slideLocText: { color: '#e5e7eb', fontSize: 12 },
  slideHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    padding: 6,
  },

  placeCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight: 16,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'visible',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    padding: 6,
  },
  placeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  placeTitleRow: { position: 'absolute', bottom: 10, left: 10, right: 10 },
  placeTitleText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  placeLocRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 6 },
  placeLocText: { color: '#e5e7eb', fontSize: 12 },

  festivalPill: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 12,
    minWidth: 140,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  festivalDate: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  festivalDateText: { fontWeight: '800', color: '#111827' },
  festivalName: { marginTop: 6, fontWeight: '700', color: '#111827' },
  festivalCity: { marginTop: 2, color: '#6b7280', fontSize: 12 },

  itineraryList: { paddingHorizontal: 16, gap: 12 },
  itineraryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itineraryCover: { width: 72, height: 72, borderRadius: 8 },
  itineraryInfo: { flex: 1 },
  itineraryTitle: { fontWeight: '800', color: '#111827' },
  itineraryMeta: { marginTop: 2, color: '#6b7280', fontSize: 12 },
  itineraryChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: { fontSize: 11, color: '#374151' },

  cta: { paddingHorizontal: 16, marginTop: 28, alignItems: 'center', gap: 12 },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#111827' },
  primaryBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
});