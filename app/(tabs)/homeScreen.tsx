// // app/(tabs)/homeScreen.tsx
// import { Href, useRouter } from 'expo-router';
// import React, { useCallback, useMemo, useRef, useState } from 'react';
// import {
//   FlatList,
//   Image,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   useWindowDimensions,
//   Alert,
//   Platform,
//   Modal,
// } from 'react-native';
// import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
// import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

// import { IconSymbol } from '@/components/ui/IconSymbol';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { useFavorites } from '@/hooks/favouritesContext';

// /* ----------------------------- Types & Data ----------------------------- */

// type Place = {
//   id: string;
//   title: string;
//   image?: any;
//   location?: string;
//   description?: string;
// };

// type Festival = { id: string; name: string; date: string; city: string };
// type Itinerary = { id: string; title: string; days: number; highlights: string[]; cover: any };

// const PLACEHOLDER = require('../../assets/images/HomeKalinchowk.jpg');

// // NOTE: Images are under project-root /assets/images, so from app/(tabs) use ../../assets/images/...
// const TOP_PLACES: Place[] = [
//   { id: 'kalinchowk', title: 'Kalinchowk', image: PLACEHOLDER, location: 'Dolakha', description: 'Snowy ridge with panoramic Himalayan views.' },
//   { id: 'pokhara', title: 'Pokhara Lakeside', image: PLACEHOLDER, location: 'Pokhara', description: 'Chill lakeside cafés and boating on Phewa.' },
//   { id: 'nagarkot', title: 'Nagarkot Sunrise', image: PLACEHOLDER, location: 'Nagarkot', description: 'Golden hour views of the Himalayan range.' },
// ];

// const ADVENTURE: Place[] = [
//   { id: 'bungee', title: 'Bungee Jumping', image: PLACEHOLDER, location: 'Kushma', description: 'Leap from Nepal’s sky‑high suspension bridge.' },
//   { id: 'zipline', title: 'Zip Lining', image: PLACEHOLDER, location: 'Pokhara', description: 'One of the world’s steepest ziplines.' },
//   { id: 'skydiving', title: 'Skydiving', image: PLACEHOLDER, location: 'Pokhara', description: 'Freefall with Annapurna at your side.' },
//   { id: 'rafting', title: 'White Water Rafting', image: PLACEHOLDER, location: 'Trishuli', description: 'Swirls, rapids, and riverside camping.' },
// ];

// const CULTURE: Place[] = [
//   { id: 'pashupatinath', title: 'Pashupatinath Temple', image: PLACEHOLDER, location: 'Kathmandu', description: 'Sacred Shiva temple on the Bagmati.' },
//   { id: 'bouddha', title: 'Bouddhanath Stupa', image: PLACEHOLDER, location: 'Kathmandu', description: 'Iconic white dome and prayer flags.' },
//   { id: 'bhaktapur', title: 'Art Bhaktapur', image: PLACEHOLDER, location: 'Bhaktapur', description: 'Woodcraft, pottery, and palace squares.' },
//   { id: 'lumbini', title: 'Lumbini', image: PLACEHOLDER, location: 'Rupandehi', description: 'Birthplace of the Buddha, calm and serene.' },
// ];

// const FESTIVALS: Festival[] = [
//   { id: 'dashain', name: 'Dashain', date: 'Oct 10', city: 'Kathmandu' },
//   { id: 'tihar', name: 'Tihar', date: 'Nov 3', city: 'Bhaktapur' },
//   { id: 'holi', name: 'Holi', date: 'Mar 22', city: 'Pokhara' },
//   { id: 'losar', name: 'Losar', date: 'Feb 9', city: 'Boudha' },
// ];

// const ITINERARIES: Itinerary[] = [
//   {
//     id: 'ktm3',
//     title: '3-Day Kathmandu Heritage',
//     days: 3,
//     highlights: ['Pashupatinath', 'Boudhanath', 'Bhaktapur'],
//     cover: PLACEHOLDER,
//   },
//   {
//     id: 'pkr5',
//     title: '5-Day Pokhara & Annapurna',
//     days: 5,
//     highlights: ['Phewa Lake', 'Sarangkot', 'Australian Camp'],
//     cover: PLACEHOLDER,
//   },
//   {
//     id: 'east4',
//     title: '4-Day Kalinchowk & Dolakha',
//     days: 4,
//     highlights: ['Kalinchowk', 'Local Temples', 'Snow Walks'],
//     cover: PLACEHOLDER,
//   },
// ];

// const CAROUSEL_SLIDES: Place[] = [
//   { id: 'pokhara', title: 'Sunrise over Phewa', image: PLACEHOLDER, location: 'Pokhara' },
//   { id: 'kalinchowk', title: 'Snowy Kalinchowk', image: PLACEHOLDER, location: 'Dolakha' },
//   { id: 'bhaktapur', title: 'Bhaktapur Heritage', image: PLACEHOLDER, location: 'Bhaktapur' },
// ];

// /* --------------------------------- Screen -------------------------------- */

// type SectionKey = 'TOP' | 'ADV' | 'CUL';

// export default function HomeScreen() {
//   const router = useRouter();
//   const colorScheme = useColorScheme();
//   const { width } = useWindowDimensions();

//   const { isFavourited, toggleFavourite } = useFavorites();

//   const [search, setSearch] = useState('');
//   const [viewAll, setViewAll] = useState<null | SectionKey>(null);

//   const cardW = useMemo(() => Math.min(280, Math.round(width * 0.7)), [width]);
//   const cardH = useMemo(() => Math.round(cardW * 0.72), [cardW]);

//   const tint = Colors[colorScheme ?? 'light'].tint;

//   const filterPlaces = useCallback(
//     (list: Place[]) => {
//       const q = search.trim().toLowerCase();
//       if (!q) return list;
//       return list.filter((p) =>
//         [p.title, p.location, p.description].filter(Boolean).some((x) => String(x).toLowerCase().includes(q))
//       );
//     },
//     [search]
//   );

//   const openDetails = (id: string) => router.push({ pathname: '/location-details', params: { id } });
//   const goFavourites = () => router.push('/(tabs)/Favourites');
//   const goHiddenGems = () => router.push('/(tabs)/HiddenGem');
//   const goFestivals = () => router.push({ pathname: '/festivals' } as unknown as Href);
//   const openFestival = (id: string) => router.push({ pathname: '/festivals/[id]', params: { id } } as unknown as Href);

//   // Build 10–15 item long lists for “View all”
//   const longList = useCallback((src: Place[], minLen = 12): Place[] => {
//     if (src.length >= minLen) return src;
//     const out: Place[] = [...src];
//     let i = 0;
//     // simple filler titles/descriptions; image uses PLACEHOLDER
//     const fillers = [
//       'Scenic Ridge Walk',
//       'Hidden Village Trail',
//       'Alpine Meadow Point',
//       'Riverside Camp',
//       'Old Monastery Walk',
//       'Stone Steps Lookout',
//       'Forest Bridge',
//       'Sunset Bend',
//       'Valley View',
//       'Glacier Vista',
//       'Tea House Lane',
//       'Heritage Alley',
//     ];
//     while (out.length < minLen) {
//       const base = src[i % src.length];
//       out.push({
//         id: `${base.id}-x${i}`,
//         title: fillers[i % fillers.length],
//         image: PLACEHOLDER,
//         location: base.location ?? 'Nepal',
//         description:
//           'Explore a beautiful spot with calm views, local culture, and an easy walk—perfect for a quick day plan.',
//       });
//       i++;
//     }
//     return out.slice(0, Math.max(minLen, src.length));
//   }, []);

//   const dataForSection = (key: SectionKey): Place[] =>
//     key === 'TOP' ? longList(TOP_PLACES, 12) : key === 'ADV' ? longList(ADVENTURE, 12) : longList(CULTURE, 12);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollBody}>
//         {/* ============================== TOP CAROUSEL ============================== */}
//         <View style={{ paddingTop: 8, marginBottom: 8 }}>
//           <TopCarousel
//             slides={CAROUSEL_SLIDES}
//             width={width}
//             isFav={(id) => isFavourited(id)}
//             onToggleFav={(id) =>
//               toggleFavourite({
//                 placeId: id,
//                 title: CAROUSEL_SLIDES.find((p) => p.id === id)?.title,
//               }).catch((e) => Alert.alert('Error', e?.message ?? 'Could not update favourite.'))
//             }
//             onOpen={openDetails}
//             tint={tint}
//           />
//         </View>

//         {/* ============================== SEARCH + QUICK ============================== */}
//         <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
//           <View style={styles.searchBar}>
//             <IconSymbol name="magnifyingglass" size={18} color="#6b7280" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search places, treks, or festivals"
//               placeholderTextColor="#9ca3af"
//               value={search}
//               onChangeText={setSearch}
//               returnKeyType="search"
//             />
//           </View>

//           <View style={styles.quickRow}>
//             <QuickAction icon="map" label="Itinerary" onPress={() => router.push('/itineraries')} />
//             <QuickAction icon="sparkles" label="Festivals" onPress={goFestivals} />
//             <QuickAction icon="star" label="Hidden Gems" onPress={goHiddenGems} />
//             <QuickAction icon="heart" label="Favourites" onPress={goFavourites} />
//           </View>
//         </View>

//         {/* ============================ TOP PLACES =========================== */}
//         <SectionHeader title="Top Places" actionLabel="View all" onAction={() => setViewAll('TOP')} />
//         <FlatList
//           data={filterPlaces(TOP_PLACES)}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 16 }}
//           renderItem={({ item }) => (
//             <PlaceCard
//               item={item}
//               width={cardW}
//               height={cardH}
//               isFav={isFavourited(item.id)}
//               onFav={() =>
//                 toggleFavourite({
//                   placeId: item.id,
//                   title: item.title,
//                 }).catch((e) => Alert.alert('Error', e?.message ?? 'Could not update favourite.'))
//               }
//               onOpen={() => openDetails(item.id)}
//               tint={tint}
//             />
//           )}
//         />

//         {/* ============================ ADVENTURE ============================ */}
//         <SectionHeader title="Adventure" actionLabel="View all" onAction={() => setViewAll('ADV')} />
//         <FlatList
//           data={filterPlaces(ADVENTURE)}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 16 }}
//           renderItem={({ item }) => (
//             <PlaceCard
//               item={item}
//               width={cardW}
//               height={cardH}
//               isFav={isFavourited(item.id)}
//               onFav={() =>
//                 toggleFavourite({
//                   placeId: item.id,
//                   title: item.title,
//                 }).catch((e) => Alert.alert('Error', e?.message ?? 'Could not update favourite.'))
//               }
//               onOpen={() => openDetails(item.id)}
//               tint={tint}
//             />
//           )}
//         />

//         {/* ============================== CULTURE ============================ */}
//         <SectionHeader title="Culture" actionLabel="View all" onAction={() => setViewAll('CUL')} />
//         <FlatList
//           data={filterPlaces(CULTURE)}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 16 }}
//           renderItem={({ item }) => (
//             <PlaceCard
//               item={item}
//               width={cardW}
//               height={cardH}
//               isFav={isFavourited(item.id)}
//               onFav={() =>
//                 toggleFavourite({
//                   placeId: item.id,
//                   title: item.title,
//                 }).catch((e) => Alert.alert('Error', e?.message ?? 'Could not update favourite.'))
//               }
//               onOpen={() => openDetails(item.id)}
//               tint={tint}
//             />
//           )}
//         />

//         {/* ========================= FESTIVAL CALENDAR ======================= */}
//         <SectionHeader title="Festival Calendar" actionLabel="See calendar" onAction={goFestivals} />
//         <FlatList
//           data={FESTIVALS}
//           keyExtractor={(f) => f.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 16 }}
//           renderItem={({ item }) => (
//             <Pressable onPress={() => openFestival(item.id)} style={{ marginRight: 12 }}>
//               <FestivalPill festival={item} />
//             </Pressable>
//           )}
//         />

//         {/* ========================= MINI ITINERARIES ======================== */}
//         <SectionHeader title="Mini Itineraries" actionLabel="Browse itineraries" onAction={() => router.push('/itineraries')} />
//         <View style={styles.itineraryList}>
//           {ITINERARIES.map((it) => (
//             <Pressable key={it.id} onPress={() => router.push(`/itineraries/${it.id}`)} style={styles.itineraryCard}>
//               <Image source={it.cover} style={styles.itineraryCover} />
//               <View style={styles.itineraryInfo}>
//                 <Text style={styles.itineraryTitle}>{it.title}</Text>
//                 <Text style={styles.itineraryMeta}>
//                   {it.days} days • {it.highlights[0]}
//                 </Text>
//                 <View style={styles.itineraryChips}>
//                   {it.highlights.slice(0, 3).map((h, i) => (
//                     <View key={i} style={styles.chip}>
//                       <Text style={styles.chipText}>{h}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//               <IconSymbol name="chevron.right" size={18} color="#9ca3af" />
//             </Pressable>
//           ))}
//         </View>
//       </ScrollView>

//       {/* ------------------------ View All (modal/sheet) ------------------------ */}
//       <Modal visible={!!viewAll} animationType="slide" onRequestClose={() => setViewAll(null)} presentationStyle="fullScreen">
//         <SafeAreaView style={styles.viewAllSafe}>
//           <View style={styles.viewAllHeader}>
//             <Pressable onPress={() => setViewAll(null)} hitSlop={8} style={styles.closeBtn}>
//               <IconSymbol name="xmark" size={18} color="#111827" />
//             </Pressable>
//             <Text style={styles.viewAllTitle}>
//               {viewAll === 'TOP' ? 'Top Places' : viewAll === 'ADV' ? 'Adventure' : 'Culture'}
//             </Text>
//           </View>

//           {/* Search is shared — it will filter this list too */}
//           <View style={[styles.searchBar, { marginHorizontal: 16, marginBottom: 8 }]}>
//             <IconSymbol name="magnifyingglass" size={18} color="#6b7280" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search these places"
//               placeholderTextColor="#9ca3af"
//               value={search}
//               onChangeText={setSearch}
//               returnKeyType="search"
//             />
//           </View>

//           <FlatList
//             data={filterPlaces(dataForSection(viewAll ?? 'TOP'))}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={{ paddingBottom: 24 }}
//             renderItem={({ item }) => (
//               <Pressable onPress={() => openDetails(item.id)} style={styles.rowCard}>
//                 <Image source={item.image ?? PLACEHOLDER} style={styles.rowThumb} />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.rowTitle}>{item.title}</Text>
//                   <Text style={styles.rowMeta}>
//                     {item.location ?? 'Nepal'} • Tap to see details
//                   </Text>
//                   {!!item.description && <Text style={styles.rowDesc}>{item.description}</Text>}
//                 </View>
//                 <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
//               </Pressable>
//             )}
//             ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//           />
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* ------------------------------ Carousel ------------------------------ */

// function TopCarousel({
//   slides,
//   width,
//   isFav,
//   onToggleFav,
//   onOpen,
//   tint,
// }: {
//   slides: Place[];
//   width: number;
//   isFav: (id: string) => boolean;
//   onToggleFav: (id: string) => void;
//   onOpen: (id: string) => void;
//   tint: string;
// }) {
//   const carouselRef = useRef<ICarouselInstance | null>(null);
//   const sliderW = width;
//   const sliderH = Math.max(180, Math.min(260, width * 0.55));

//   return (
//     <Carousel
//       ref={carouselRef}
//       width={sliderW}
//       height={sliderH}
//       data={slides}
//       loop
//       autoPlay
//       autoPlayInterval={3000}
//       pagingEnabled
//       scrollAnimationDuration={700}
//       renderItem={({ item, animationValue }: { item: Place; animationValue: any }) => {
//         const style = useAnimatedStyle(() => ({
//           transform: [
//             {
//               scale: interpolate(animationValue.value, [-1, 0, 1], [0.92, 1, 0.92], Extrapolation.CLAMP),
//             },
//           ],
//         }));

//         return (
//           <Animated.View style={[styles.slideCard, style]}>
//             <Pressable onPress={() => onOpen(item.id)} style={{ flex: 1, borderRadius: 16, overflow: 'hidden' }}>
//               <Image source={item.image ?? PLACEHOLDER} style={{ width: '100%', height: '100%' }} />
//               <View style={styles.slideOverlay} />
//               <View style={styles.slideContent}>
//                 <Text style={styles.slideTitle}>{item.title}</Text>
//                 {!!item.location && (
//                   <View style={styles.slideLocRow}>
//                     <IconSymbol name="mappin.and.ellipse" size={12} color="#fff" />
//                     <Text style={styles.slideLocText}>{item.location}</Text>
//                   </View>
//                 )}
//               </View>
//             </Pressable>

//             {/* Keep heart fully pressable on web */}
//             <Pressable onPress={() => onToggleFav(item.id)} style={styles.slideHeart} hitSlop={8}>
//               <IconSymbol name={isFav(item.id) ? 'heart.fill' : 'heart'} size={22} color={isFav(item.id) ? tint : '#111827'} />
//             </Pressable>
//           </Animated.View>
//         );
//       }}
//     />
//   );
// }

// /* ------------------------------ Reusables ------------------------------ */

// function SectionHeader({
//   title,
//   actionLabel,
//   onAction,
// }: {
//   title: string;
//   actionLabel?: string;
//   onAction?: () => void;
// }) {
//   return (
//     <View style={styles.sectionHeaderRow}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       {actionLabel && onAction ? (
//         <Pressable onPress={onAction} hitSlop={8}>
//           <Text style={styles.sectionAction}>{actionLabel}</Text>
//         </Pressable>
//       ) : null}
//     </View>
//   );
// }

// function QuickAction({
//   icon,
//   label,
//   onPress,
// }: {
//   icon: React.ComponentProps<typeof IconSymbol>['name'];
//   label: string;
//   onPress: () => void;
// }) {
//   return (
//     <Pressable style={styles.quick} onPress={onPress}>
//       <View style={styles.quickIconWrap}>
//         <IconSymbol name={icon} size={18} color="#1f2937" />
//       </View>
//       <Text style={styles.quickLabel}>{label}</Text>
//     </Pressable>
//   );
// }

// function PlaceCard({
//   item,
//   width,
//   height,
//   isFav,
//   onFav,
//   onOpen,
//   tint,
// }: {
//   item: Place;
//   width: number;
//   height: number;
//   isFav: boolean;
//   onFav: () => void;
//   onOpen: () => void;
//   tint: string;
// }) {
//   return (
//     <View style={[styles.placeCard, { width }]}>
//       <Pressable onPress={onOpen} style={{ borderRadius: 14, overflow: 'hidden' }}>
//         <Image source={item.image ?? PLACEHOLDER} style={{ width, height }} />
//         <View style={styles.placeGradient} />
//         <View style={styles.placeTitleRow}>
//           <Text style={styles.placeTitleText}>{item.title}</Text>
//           {item.location ? (
//             <View style={styles.placeLocRow}>
//               <IconSymbol name="mappin.and.ellipse" size={12} color="#fff" />
//               <Text style={styles.placeLocText}>{item.location}</Text>
//             </View>
//           ) : null}
//         </View>
//       </Pressable>

//       {/* Keep above image for web clicks */}
//       <Pressable onPress={onFav} style={[styles.heartBtn, Platform.OS === 'web' && { zIndex: 5 }]} hitSlop={8}>
//         <IconSymbol name={isFav ? 'heart.fill' : 'heart'} size={22} color={isFav ? tint : '#111827'} />
//       </Pressable>
//     </View>
//   );
// }

// function FestivalPill({ festival }: { festival: Festival }) {
//   return (
//     <View style={styles.festivalPill}>
//       <View style={styles.festivalDate}>
//         <IconSymbol name="calendar" size={14} color="#111827" />
//         <Text style={styles.festivalDateText}>{festival.date}</Text>
//       </View>
//       <Text style={styles.festivalName}>{festival.name}</Text>
//       <Text style={styles.festivalCity}>{festival.city}</Text>
//     </View>
//   );
// }

// /* -------------------------------- Styles ------------------------------- */

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#f8fafc' },
//   scrollBody: { paddingBottom: 48 },

//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: '#ffffff',
//     borderRadius: 999,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//   },
//   searchInput: { flex: 1, paddingVertical: 0, color: '#111827' },

//   quickRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
//   quick: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     paddingVertical: 12,
//     gap: 6,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   quickIconWrap: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 999 },
//   quickLabel: { fontSize: 12, fontWeight: '600', color: '#111827' },

//   sectionHeaderRow: {
//     paddingHorizontal: 16,
//     marginTop: 24,
//     marginBottom: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//   },
//   sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
//   sectionAction: { color: '#2563eb', fontWeight: '700' },

//   slideCard: {
//     flex: 1,
//     marginHorizontal: 12,
//     borderRadius: 16,
//     backgroundColor: '#fff',
//     overflow: 'visible',
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 3,
//   },
//   slideOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
//   slideContent: { position: 'absolute', left: 14, right: 14, bottom: 14 },
//   slideTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
//   slideLocRow: { marginTop: 6, flexDirection: 'row', gap: 6, alignItems: 'center' },
//   slideLocText: { color: '#e5e7eb', fontSize: 12 },
//   slideHeart: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: 'rgba(255,255,255,0.92)',
//     borderRadius: 999,
//     padding: 6,
//   },

//   placeCard: {
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     marginRight: 16,
//     paddingBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//     overflow: 'visible',
//   },
//   heartBtn: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     borderRadius: 999,
//     padding: 6,
//   },
//   placeGradient: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 68,
//     backgroundColor: 'rgba(0,0,0,0.35)',
//   },
//   placeTitleRow: { position: 'absolute', bottom: 10, left: 10, right: 10 },
//   placeTitleText: { color: '#fff', fontWeight: '800', fontSize: 16 },
//   placeLocRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 6 },
//   placeLocText: { color: '#e5e7eb', fontSize: 12 },

//   festivalPill: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginRight: 12,
//     minWidth: 140,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   festivalDate: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   festivalDateText: { fontWeight: '800', color: '#111827' },
//   festivalName: { marginTop: 6, fontWeight: '700', color: '#111827' },
//   festivalCity: { marginTop: 2, color: '#6b7280', fontSize: 12 },

//   itineraryList: { paddingHorizontal: 16, gap: 12 },
//   itineraryCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   itineraryCover: { width: 72, height: 72, borderRadius: 8 },
//   itineraryInfo: { flex: 1 },
//   itineraryTitle: { fontWeight: '800', color: '#111827' },
//   itineraryMeta: { marginTop: 2, color: '#6b7280', fontSize: 12 },
//   itineraryChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
//   chip: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
//   chipText: { fontSize: 11, color: '#374151' },

//   cta: { paddingHorizontal: 16, marginTop: 28, alignItems: 'center', gap: 12 },
//   ctaText: { fontSize: 18, fontWeight: '800', color: '#111827' },
//   primaryBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
//   primaryBtnText: { color: '#fff', fontWeight: '800' },

//   // View all
//   viewAllSafe: { flex: 1, backgroundColor: '#f8fafc' },
//   viewAllHeader: {
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     paddingBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   closeBtn: {
//     backgroundColor: '#fff',
//     borderRadius: 999,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   viewAllTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },

//   rowCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginHorizontal: 16,
//     padding: 12,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   rowThumb: { width: 92, height: 92, borderRadius: 10, backgroundColor: '#e5e7eb' },
//   rowTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
//   rowMeta: { marginTop: 2, color: '#6b7280', fontSize: 12 },
//   rowDesc: { marginTop: 4, color: '#374151', fontSize: 13 },
// });
// app/(tabs)/homeScreen.tsx
import { Href, router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useFavorites } from '@/hooks/favouritesContext';
import useAppwriteUser from '@/hooks/useAppwriteUser';
import { useColorScheme } from '@/hooks/useColorScheme';

// shared data (each Place has a static require() image)
import { ADVENTURE, CULTURE, TOP_PLACES, type Place } from '@/app/data/places';

type Festival = { id: string; name: string; date: string; city: string };
type Itinerary = { id: string; title: string; days: number; highlights: string[]; cover: any };

/** simple festival+itinerary samples */
const FESTIVALS: Festival[] = [
  { id: 'dashain', name: 'Dashain', date: 'Oct 10', city: 'Kathmandu' },
  { id: 'tihar',   name: 'Tihar',   date: 'Nov 3',  city: 'Bhaktapur' },
  { id: 'holi',    name: 'Holi',    date: 'Mar 22', city: 'Pokhara' },
  { id: 'losar',   name: 'Losar',   date: 'Feb 9',  city: 'Boudha' },
];

const ITINERARIES: Itinerary[] = [
  { id: 'ktm3',  title: '3‑Day Kathmandu Heritage',   days: 3, highlights: ['Pashupatinath','Boudhanath','Bhaktapur'], cover: TOP_PLACES.find(p=>p.id==='bhaktapur')?.image ?? TOP_PLACES[0].image },
  { id: 'pkr5',  title: '5‑Day Pokhara & Annapurna',  days: 5, highlights: ['Phewa Lake','Sarangkot','Australian Camp'], cover: TOP_PLACES.find(p=>p.id==='pokhara')?.image   ?? TOP_PLACES[0].image },
  { id: 'east4', title: '4‑Day Kalinchowk & Dolakha', days: 4, highlights: ['Kalinchowk','Local Temples','Snow Walks'],  cover: TOP_PLACES.find(p=>p.id==='kalinchowk')?.image ?? TOP_PLACES[0].image },
];

// top hero pulls first 3 from your Top Places
const CAROUSEL_SLIDES: Place[] = TOP_PLACES.slice(0, 3);

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const { isFavourited, toggleFavourite } = useFavorites();
  const { user, loading } = useAppwriteUser();

  const [search, setSearch] = useState('');

  const cardW = useMemo(() => Math.min(280, Math.round(width * 0.7)), [width]);
  const cardH = useMemo(() => Math.round(cardW * 0.72), [cardW]);
  const tint = Colors[colorScheme ?? 'light'].tint;

  // ---------- helpers ----------
  const filter = useCallback((list: Place[]) => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q) ||
      (p.location ?? '').toLowerCase().includes(q)
    );
  }, [search]);

  // Guard so we never attempt to write before auth is ready
  const safeToggle = useCallback(async (payload: { placeId: string; title?: string; description?: string }) => {
    if (loading) return; // ignore until we know auth state
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to save favourites.');
      return;
    }
    try {
      await toggleFavourite(payload);
    } catch (e: any) {
      console.log('toggleFavourite error:', e?.response ?? e);
      Alert.alert('Error', e?.message ?? 'Could not update favourite.');
    }
  }, [loading, user, toggleFavourite]);

  const openDetails = (id: string) => router.push({ pathname: '/location-details', params: { id } });
  const goFavourites = () => router.push('/(tabs)/Favourites');
  const goHiddenGems = () => router.push('/(tabs)/HiddenGem');
  const goFestivals = () => router.push({ pathname: '/festivals' } as unknown as Href);
  const openFestival = (id: string) => router.push({ pathname: '/festivals/[id]', params: { id } } as unknown as Href);
  const viewAll = (category: 'top' | 'adventure' | 'culture') =>
    router.push({ pathname: '/view-all', params: { category } });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* ======= Top Carousel ======= */}
        <View style={{ paddingTop: 8, marginBottom: 8, pointerEvents: 'box-none' as any }}>
          <TopCarousel
            slides={CAROUSEL_SLIDES}
            width={width}
            isFav={(id) => isFavourited(id)}
            onToggleFav={(id) => {
              const p = CAROUSEL_SLIDES.find(x => x.id === id);
              safeToggle({ placeId: id, title: p?.title, description: p?.description });
            }}
            onOpen={openDetails}
            tint={tint}
          />
        </View>

        {/* ======= Search & Quick ======= */}
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
            <QuickAction icon="map" label="Itinerary"   onPress={() => router.push('/itineraries')} />
            <QuickAction icon="sparkles" label="Festivals" onPress={goFestivals} />
            <QuickAction icon="star" label="Hidden Gems" onPress={goHiddenGems} />
            <QuickAction icon="heart" label="Favourites" onPress={goFavourites} />
          </View>
        </View>

        {/* ======= Top Places ======= */}
        <SectionHeader title="Top Places" actionLabel="View all" onAction={() => viewAll('top')} />
        <HorizontalPlaces
          data={filter(TOP_PLACES).slice(0, 8)}
          cardW={cardW}
          cardH={cardH}
          isFav={isFavourited}
          onFav={(p) => safeToggle({ placeId: p.id, title: p.title, description: p.description })}
          onOpen={(p) => openDetails(p.id)}
          tint={tint}
        />

        {/* ======= Adventure ======= */}
        <SectionHeader title="Adventure" actionLabel="View all" onAction={() => viewAll('adventure')} />
        <HorizontalPlaces
          data={filter(ADVENTURE).slice(0, 8)}
          cardW={cardW}
          cardH={cardH}
          isFav={isFavourited}
          onFav={(p) => safeToggle({ placeId: p.id, title: p.title, description: p.description })}
          onOpen={(p) => openDetails(p.id)}
          tint={tint}
        />

        {/* ======= Culture ======= */}
        <SectionHeader title="Culture" actionLabel="View all" onAction={() => viewAll('culture')} />
        <HorizontalPlaces
          data={filter(CULTURE).slice(0, 8)}
          cardW={cardW}
          cardH={cardH}
          isFav={isFavourited}
          onFav={(p) => safeToggle({ placeId: p.id, title: p.title, description: p.description })}
          onOpen={(p) => openDetails(p.id)}
          tint={tint}
        />

        {/* ======= Festival Calendar ======= */}
        <SectionHeader title="Festival Calendar" actionLabel="See calendar" onAction={goFestivals} />
        <FlatList
          data={FESTIVALS}
          keyExtractor={(f: Festival) => f.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => openFestival(item.id)} style={{ marginRight: 12 }}>
              <FestivalPill festival={item} />
            </Pressable>
          )}
        />

        {/* ======= Mini Itineraries ======= */}
        <SectionHeader title="Mini Itineraries" actionLabel="Browse itineraries" onAction={() => router.push('/itineraries')} />
        <View style={styles.itineraryList}>
          {ITINERARIES.map((it) => (
            <Pressable key={it.id} onPress={() => router.push(`/itineraries/${it.id}`)} style={styles.itineraryCard}>
              <Image source={it.cover} style={styles.itineraryCover} />
              <View style={styles.itineraryInfo}>
                <Text style={styles.itineraryTitle}>{it.title}</Text>
                <Text style={styles.itineraryMeta}>{it.days} days • {it.highlights[0]}</Text>
                <View style={styles.itineraryChips}>
                  {it.highlights.slice(0, 3).map((h, i) => (
                    <View key={i} style={styles.chip}><Text style={styles.chipText}>{h}</Text></View>
                  ))}
                </View>
              </View>
              <IconSymbol name="chevron.right" size={18} color="#9ca3af" />
            </Pressable>
          ))}
        </View>

        <View style={styles.cta}>
          <Text style={styles.ctaText}>Ready to plan your trip?</Text>
          <Pressable style={[styles.primaryBtn, { backgroundColor: tint }]} onPress={() => router.push('/itineraries')}>
            <Text style={styles.primaryBtnText}>Build My Itinerary</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============================ components ============================ */

function TopCarousel({
  slides, width, isFav, onToggleFav, onOpen, tint,
}: {
  slides: Place[]; width: number;
  isFav: (id: string) => boolean; onToggleFav: (id: string) => void;
  onOpen: (id: string) => void; tint: string;
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
          transform: [{ scale: interpolate(animationValue.value, [-1, 0, 1], [0.92, 1, 0.92], Extrapolation.CLAMP) }],
        }));
        return (
          <Animated.View style={[styles.slideCard, style, { pointerEvents: 'box-none' as any }]}>
            <Pressable onPress={() => onOpen(item.id)} style={{ flex: 1, borderRadius: 16, overflow: 'hidden' }}>
              <Image source={item.image} style={{ width: '100%', height: '100%' }} />
              <View style={styles.slideOverlay} pointerEvents="none" />
              <View style={styles.slideContent} pointerEvents="none">
                <Text style={styles.slideTitle}>{item.title}</Text>
                {!!item.location && (
                  <View style={styles.slideLocRow}>
                    <IconSymbol name="mappin.and.ellipse" size={12} color="#fff" />
                    <Text style={styles.slideLocText}>{item.location}</Text>
                  </View>
                )}
              </View>
            </Pressable>

            {/* web-friendly heart button */}
            <Pressable onPress={() => onToggleFav(item.id)} style={styles.slideHeart}>
              <IconSymbol name={isFav(item.id) ? 'heart.fill' : 'heart'} size={22} color={isFav(item.id) ? tint : '#111827'} />
            </Pressable>
          </Animated.View>
        );
      }}
    />
  );
}

function HorizontalPlaces({
  data, cardW, cardH, isFav, onFav, onOpen, tint,
}: {
  data: Place[]; cardW: number; cardH: number;
  isFav: (id: string) => boolean;
  onFav: (p: Place) => void;
  onOpen: (p: Place) => void;
  tint: string;
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      renderItem={({ item }) => (
        <View style={[styles.placeCard, { width: cardW }]}>
          <Pressable onPress={() => onOpen(item)} style={{ borderRadius: 14, overflow: 'hidden' }}>
            <Image source={item.image} style={{ width: cardW, height: cardH }} />
            <View style={styles.placeGradient} pointerEvents="none" />
            <View style={styles.placeTitleRow} pointerEvents="none">
              <Text style={styles.placeTitleText}>{item.title}</Text>
              {item.location ? (
                <View style={styles.placeLocRow}>
                  <IconSymbol name="mappin.and.ellipse" size={12} color="#fff" />
                  <Text style={styles.placeLocText}>{item.location}</Text>
                </View>
              ) : null}
            </View>
          </Pressable>

          <Pressable onPress={() => onFav(item)} style={styles.heartBtn}>
            <IconSymbol name={isFav(item.id) ? 'heart.fill' : 'heart'} size={22} color={isFav(item.id) ? tint : '#111827'} />
          </Pressable>
        </View>
      )}
    />
  );
}

function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} style={{ cursor: Platform.OS === 'web' ? 'pointer' : undefined }}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function FestivalPill({ festival }: { festival: Festival }) {
  return (
    <View style={styles.festivalPill}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <IconSymbol name="calendar" size={14} color="#111827" />
        <Text style={{ fontWeight: '800', color: '#111827' }}>{festival.date}</Text>
      </View>
      <Text style={{ marginTop: 6, fontWeight: '700', color: '#111827' }}>{festival.name}</Text>
      <Text style={{ marginTop: 2, color: '#6b7280', fontSize: 12 }}>{festival.city}</Text>
    </View>
  );
}

/* =============================== styles =============================== */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollBody: { paddingBottom: 56 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffffff',
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  searchInput: { flex: 1, paddingVertical: 0, color: '#111827' },

  quickRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  quick: {
    flex: 1, alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 12, paddingVertical: 12, gap: 6,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  quickIconWrap: { backgroundColor: '#f3f4f6', padding: 8, borderRadius: 999 },
  quickLabel: { fontSize: 12, fontWeight: '600', color: '#111827' },

  sectionHeaderRow: { paddingHorizontal: 16, marginTop: 24, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  sectionAction: { color: '#2563eb', fontWeight: '700' },

  slideCard: {
    flex: 1, marginHorizontal: 12, borderRadius: 16, backgroundColor: '#fff', overflow: 'visible',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  slideOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  slideContent: { position: 'absolute', left: 14, right: 14, bottom: 14 },
  slideTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  slideLocRow: { marginTop: 6, flexDirection: 'row', gap: 6, alignItems: 'center' },
  slideLocText: { color: '#e5e7eb', fontSize: 12 },
  slideHeart: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 999, padding: 6 },

  placeCard: {
    backgroundColor: '#fff', borderRadius: 14, marginRight: 16, paddingBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
    overflow: 'visible',
  },
  heartBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 999, padding: 6 },
  placeGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 68, backgroundColor: 'rgba(0,0,0,0.35)' },
  placeTitleRow: { position: 'absolute', bottom: 10, left: 10, right: 10 },
  placeTitleText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  placeLocRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 6 },
  placeLocText: { color: '#e5e7eb', fontSize: 12 },

  festivalPill: {
    backgroundColor: '#ffffff', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, marginRight: 12, minWidth: 140,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },

  itineraryList: { paddingHorizontal: 16, gap: 12 },
  itineraryCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  itineraryCover: { width: 72, height: 72, borderRadius: 8 },
  itineraryInfo: { flex: 1 },
  itineraryTitle: { fontWeight: '800', color: '#111827' },
  itineraryMeta: { marginTop: 2, color: '#6b7280', fontSize: 12 },
  itineraryChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  chipText: { fontSize: 11, color: '#374151' },

  cta: { paddingHorizontal: 16, marginTop: 28, alignItems: 'center', gap: 12 },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#111827' },
  primaryBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
});

function QuickAction({
  icon, label, onPress,
}: { icon: React.ComponentProps<typeof IconSymbol>['name']; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.quick} onPress={onPress}>
      <View style={styles.quickIconWrap}><IconSymbol name={icon} size={18} color="#1f2937" /></View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}