// app/(tabs)/homeScreen.tsx
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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

/* ----------------------------- Mocked Content ----------------------------- */

// Top places (uses your existing images)
const TOP_PLACES = [
  { id: 'kalinchowk', title: 'Kalinchowk', image: require('../../assets/images/HomeKalinchowk.jpg') },
  { id: 'pokhara',    title: 'Pokhara Lakeside', image: require('../../assets/images/HomePokhara.jpg') },
  { id: 'nagarkot',   title: 'Nagarkot Sunrise', image: require('../../assets/images/HomeNagarkot.jpg') },
];

// Festival calendar (sample data)
const FESTIVALS = [
  { id: 'dashain', name: 'Dashain', date: 'Oct 10', city: 'Kathmandu' },
  { id: 'tihar',   name: 'Tihar',   date: 'Nov 3',  city: 'Bhaktapur' },
  { id: 'holi',    name: 'Holi',    date: 'Mar 22', city: 'Pokhara' },
  { id: 'losar',   name: 'Losar',   date: 'Feb 9',  city: 'Boudha' },
];

// Mini itineraries (sample data)
const ITINERARIES = [
  {
    id: 'ktm3',
    title: '3-Day Kathmandu Heritage',
    days: 3,
    highlights: ['Pashupatinath', 'Boudhanath', 'Bhaktapur'],
    cover: require('../../assets/images/HomeBhaktapur.jpg'),
  },
  {
    id: 'pkr5',
    title: '5-Day Pokhara & Annapurna',
    days: 5,
    highlights: ['Phewa Lake', 'Sarangkot', 'Australian Camp'],
    cover: require('../../assets/images/HomePokhara.jpg'),
  },
  {
    id: 'east4',
    title: '4-Day Kalinchowk & Dolakha',
    days: 4,
    highlights: ['Kalinchowk', 'Local Temples', 'Snow Walks'],
    cover: require('../../assets/images/HomeKalinchowk.jpg'),
  },
];

/* --------------------------------- Types --------------------------------- */
type Place = { id: string; title: string; image: any };
type Itinerary = {
  id: string;
  title: string;
  days: number;
  highlights: string[];
  cover: any;
};
type Festival = { id: string; name: string; date: string; city: string };

/* --------------------------------- Screen -------------------------------- */
export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  const [search, setSearch] = useState('');

  // Card sizing (responsive)
  const maxCardWidth = 280;
  const cardWidth = Math.min(maxCardWidth, width * 0.7);
  const cardHeight = cardWidth * 0.75;

  // Filter for search bar
  const filteredPlaces = useMemo<Place[]>(
    () => TOP_PLACES.filter(p => p.title.toLowerCase().includes(search.trim().toLowerCase())),
    [search]
  );

  // ✅ FIX: route names must match your files. We route to /location-details (you created it),
  // and to tabs using /(tabs)/Discover, etc. Adjust if you add real pages.
  const onPlacePress = (id: string, title: string) =>
    router.push({ pathname: '/location-details', params: { id, title } });

  const go = (path: string) => router.push(path as any);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* ============================== HERO ============================== */}
        <View style={styles.hero}>
          <Image
            source={require('../../assets/images/kalinchowk.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Explore Nepal</Text>
            <Text style={styles.heroSubtitle}>
              Mountains, culture, and once-in-a-lifetime adventures.
            </Text>

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

            {/* Quick Actions */}
            <View style={styles.quickRow}>
              <QuickAction icon="map" label="Itinerary" onPress={() => go('/itineraries')} />
              <QuickAction icon="sparkles" label="Festivals" onPress={() => go('/festivals')} />
              <QuickAction icon="mappin.and.ellipse" label="Top Places" onPress={() => go('/top-places')} />
              {/* ✅ FIX: Discover tab is app/(tabs)/Discover.tsx (capital D) */}
              <QuickAction icon="binoculars" label="Discover" onPress={() => go('/(tabs)/Discover')} />
            </View>
          </View>
        </View>

        {/* ============================ TOP PLACES =========================== */}
        <SectionHeader title="Top Places" actionLabel="View all" onAction={() => go('/top-places')} />
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <View style={[styles.placeCard, { width: cardWidth }]}>
              <Pressable
                onPress={() => onPlacePress(item.id, item.title)}
                style={{ borderRadius: 12, overflow: 'hidden' }}
              >
                <Image source={item.image} style={{ width: cardWidth, height: cardHeight }} />
              </Pressable>
              <Text style={styles.placeTitle}>{item.title}</Text>
            </View>
          )}
        />

        {/* ========================= FESTIVAL CALENDAR ======================= */}
        <SectionHeader title="Festival Calendar" actionLabel="See calendar" onAction={() => go('/festivals')} />
        <FlatList
          data={FESTIVALS}
          keyExtractor={(f) => f.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => <FestivalPill festival={item} />}
        />

        {/* ========================= MINI ITINERARIES ======================== */}
        <SectionHeader title="Mini Itineraries" actionLabel="Browse itineraries" onAction={() => go('/itineraries')} />
        <View style={styles.itineraryList}>
          {ITINERARIES.map((it) => (
            <Pressable key={it.id} onPress={() => go(`/itineraries/${it.id}`)} style={styles.itineraryCard}>
              <Image source={it.cover} style={styles.itineraryCover} />
              <View style={styles.itineraryInfo}>
                <Text style={styles.itineraryTitle}>{it.title}</Text>
                <Text style={styles.itineraryMeta}>{it.days} days • {it.highlights[0]}</Text>
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

        {/* ============================== CTA =============================== */}
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Ready to plan your trip?</Text>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => go('/itineraries')}
          >
            <Text style={styles.primaryBtnText}>Build My Itinerary</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollBody: { paddingBottom: 40 },

  /* HERO */
  hero: { position: 'relative', width: '100%', aspectRatio: 2 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  heroContent: { position: 'absolute', left: 16, right: 16, bottom: 16, gap: 12 },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  heroSubtitle: { color: '#e5e7eb', fontSize: 14 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#ffffff', borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 10,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  searchInput: { flex: 1, paddingVertical: 0, color: '#111827' },

  quickRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  quick: {
    flex: 1, alignItems: 'center', backgroundColor: '#ffffff',
    borderRadius: 12, paddingVertical: 12, gap: 6,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  quickIconWrap: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 999 },
  quickLabel: { fontSize: 12, fontWeight: '600', color: '#111827' },

  /* SECTION HEADER */
  sectionHeaderRow: {
    paddingHorizontal: 16, marginTop: 24, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  sectionAction: { color: '#2563eb', fontWeight: '700' },

  /* TOP PLACES */
  placeCard: {
    backgroundColor: '#fff', borderRadius: 12, marginRight: 16, paddingBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  placeTitle: { marginTop: 10, paddingHorizontal: 8, fontSize: 16, fontWeight: '700', color: '#111827' },

  /* FESTIVAL PILL */
  festivalPill: {
    backgroundColor: '#ffffff', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12,
    marginRight: 12, minWidth: 140, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  festivalDate: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  festivalDateText: { fontWeight: '800', color: '#111827' },
  festivalName: { marginTop: 6, fontWeight: '700', color: '#111827' },
  festivalCity: { marginTop: 2, color: '#6b7280', fontSize: 12 },

  /* ITINERARIES */
  itineraryList: { paddingHorizontal: 16, gap: 12 },
  itineraryCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 10, flexDirection: 'row',
    alignItems: 'center', gap: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  itineraryCover: { width: 72, height: 72, borderRadius: 8 },
  itineraryInfo: { flex: 1 },
  itineraryTitle: { fontWeight: '800', color: '#111827' },
  itineraryMeta: { marginTop: 2, color: '#6b7280', fontSize: 12 },
  itineraryChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  chipText: { fontSize: 11, color: '#374151' },

  /* CTA */
  cta: { paddingHorizontal: 16, marginTop: 28, alignItems: 'center', gap: 12 },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#111827' },
  primaryBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
});
