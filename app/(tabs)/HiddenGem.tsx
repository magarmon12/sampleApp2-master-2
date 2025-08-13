// app/(tabs)/HiddenGem.tsx
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import useAppwriteUser from '@/hooks/useAppwriteUser';
import { useColorScheme } from '@/hooks/useColorScheme';
import { databases, ID, IDs, Query } from '@/lib/appwrite';
import { FavoriteDoc, listFavoritesByUser, removeFavoriteById } from '@/lib/favourites';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

/* ------------------------------- Types --------------------------------- */
type Gem = {
  id: number;
  name: string;
  location: string;
  shortDesc: string;
  fullDescription: string;
  image: string;            // remote URL
  difficulty: string;
  bestTime: string;
  duration: string;
};

type NewFav = Pick<FavoriteDoc, 'userId' | 'placeId' | 'title' | 'image' | 'description'>;

/** Make a unique placeId namespace so it won't collide with home places */
const placeIdFor = (gem: Gem) => `hidden:${gem.id}`;

/* ------------------------------ Data ----------------------------------- */
const HIDDEN_GEMS: Gem[] = [
  {
    id: 1,
    name: "Tilicho Lake",
    location: "Manang District, Gandaki Province",
    shortDesc: "One of the highest lakes in the world at 4,919 meters",
    fullDescription: "Tilicho Lake is one of the highest lakes in the world, situated at an altitude of 4,919 meters. This pristine alpine lake offers breathtaking views of the Annapurna range and is considered sacred by both Hindus and Buddhists. The trek to Tilicho is challenging, requiring good physical fitness and acclimatization, but rewards visitors with incredible mountain vistas and spiritual tranquility. The lake's crystal-clear waters reflect the surrounding peaks, creating a mirror-like effect that's truly mesmerizing. Best visited during autumn (September-November) and spring (March-May) seasons.",
    image: "https://cdn.kimkim.com/files/a/images/0e0350802029b14da46c5162c2e6227458751a63/big-779eb8833d6ab03cd63f1c59d4fb9b3d.jpg",
    difficulty: "Challenging",
    bestTime: "March-May, September-November",
    duration: "12-15 days"
  },
  {
    id: 2,
    name: "Rara Lake",
    location: "Mugu District, Karnali Province",
    shortDesc: "Nepal's largest lake, known as the 'Queen of Lakes'",
    fullDescription: "Rara Lake, also known as Mahendra Tal, is Nepal's largest lake covering an area of 10.8 square kilometers. Located at 2,990 meters above sea level, this remote gem is surrounded by pristine Rara National Park. The lake's crystal-clear blue waters are home to the endemic snow trout, and the surrounding forests harbor diverse wildlife including red panda, musk deer, and Himalayan black bear. The area offers complete solitude and is perfect for those seeking to disconnect from the modern world while connecting with nature's raw beauty.",
    image: "https://nepaltreksandtour.com/wp-content/uploads/2024/05/New-Project-2024-05-20T000158.810.png",
    difficulty: "Moderate",
    bestTime: "April-May, September-November",
    duration: "7-10 days"
  },
  {
    id: 3,
    name: "Khaptad National Park",
    location: "Bajhang, Bajura, Doti & Achham Districts",
    shortDesc: "Rolling hills, pristine meadows, and diverse wildlife",
    fullDescription: "Khaptad National Park spans 225 square kilometers of rolling hills, pristine meadows, and dense forests. This lesser-known national park is a biodiversity hotspot, home to 567 species of flora and fauna. The park's spiritual significance comes from the ashram of late Khaptad Baba, a revered Hindu saint. Visitors can explore beautiful grasslands, witness diverse bird species, and experience the unique culture of the Khas people. The park offers excellent opportunities for meditation, nature photography, and cultural immersion in one of Nepal's most peaceful settings.",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/12/Khaptad_National_Park.JPG",
    difficulty: "Easy to Moderate",
    bestTime: "March-May, October-December",
    duration: "5-7 days"
  },
  {
    id: 4,
    name: "Shey Phoksundo Lake",
    location: "Dolpa District, Karnali Province",
    shortDesc: "Nepal's deepest lake with turquoise waters",
    fullDescription: "Located in Shey Phoksundo National Park, this turquoise jewel is Nepal's deepest lake at 145 meters. The lake's stunning blue-green color comes from its mineral content and depth. Surrounded by barren cliffs and snow-capped peaks, it offers a mystical experience reminiscent of the Tibetan plateau. The area is culturally rich, inhabited by people of Tibetan origin who follow Bon Buddhism. The trek offers glimpses of ancient monasteries, prayer wheels, and traditional Tibetan architecture. The region was featured in the movie 'Himalaya' (1999).",
    image: "https://www.nepalhimalayastrekking.com/public/uploads/download-1.jpg",
    difficulty: "Challenging",
    bestTime: "May-October",
    duration: "15-20 days"
  },
  {
    id: 5,
    name: "Panch Pokhari",
    location: "Sindhupalchok District, Bagmati Province",
    shortDesc: "Five sacred lakes at 4,100 meters altitude",
    fullDescription: "Panch Pokhari, meaning 'five lakes' in Nepali, consists of five sacred lakes situated at 4,100 meters above sea level. These glacial lakes are considered holy by both Hindus and Buddhists, with thousands of pilgrims visiting during the Janai Purnima festival. The trek offers spectacular views of Dorje Lakpa (6,966m), Phurbi Chyachu (6,637m), and other Himalayan peaks. Each lake has its own unique characteristics and spiritual significance. The area is known for its alpine flowers, including the rare blue poppy, Nepal's national flower.",
    image: "https://www.himalayajourneys.com/assets/images/off-the-beaten/panch-pokhari-trek.jpg",
    difficulty: "Moderate to Challenging",
    bestTime: "April-June, September-November",
    duration: "8-10 days"
  },
  {
    id: 6,
    name: "Langtang Valley",
    location: "Rasuwa District, Bagmati Province",
    shortDesc: "Known as the 'Valley of Glaciers'",
    fullDescription: "Langtang Valley, known as the 'Valley of Glaciers', is a hidden gem offering close-up views of towering peaks and unique Tamang culture. The valley was severely affected by the 2015 earthquake but has since recovered beautifully. The trek passes through ancient rhododendron forests, traditional stone houses, and terraced fields. Kyanjin Gompa, an ancient Buddhist monastery, serves as the main attraction. The area offers stunning views of Langtang Lirung (7,227m) and other peaks. The local Tamang people have Tibetan origins and maintain their distinct culture and traditions.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRLSB4uVzVx_6uEanKEauH5Axd8D6loNLPHA&s",
    difficulty: "Moderate",
    bestTime: "March-May, September-November",
    duration: "7-10 days"
  },
  {
    id: 7,
    name: "Upper Mustang",
    location: "Mustang District, Gandaki Province",
    shortDesc: "The Last Forbidden Kingdom with ancient caves and monasteries",
    fullDescription: "Upper Mustang, once the Kingdom of Lo, was only opened to tourists in 1992. This high-altitude desert region resembles Tibet with its barren landscapes, ancient caves, and medieval monasteries. The capital, Lo Manthang, is a walled city with a 600-year-old palace. The region preserves pure Tibetan Buddhism and culture, with locals speaking Tibetan dialects. Thousands of man-made caves dot the cliffs, some dating back 3,000 years. The area offers unique geological formations, ancient trade routes, and opportunities to witness one of the world's last traditional kingdoms.",
    image: "https://himalayasonfoot.com/wp-content/uploads/2024/02/Upper-Mustang-Trek.jpg",
    difficulty: "Moderate",
    bestTime: "March-November",
    duration: "12-14 days"
  },
  {
    id: 8,
    name: "Manaslu Circuit",
    location: "Gorkha District, Gandaki Province",
    shortDesc: "Less crowded alternative to Annapurna Circuit",
    fullDescription: "The Manaslu Circuit trek is a spectacular journey around the world's eighth-highest mountain, Manaslu (8,163m). This less crowded alternative to the Annapurna Circuit offers pristine mountain scenery, diverse cultures, and challenging terrain. The trek passes through subtropical forests, alpine meadows, and high-altitude deserts. You'll encounter Gurung and Tibetan communities, ancient monasteries, and traditional villages. The Larkya La Pass at 5,106m is the trek's highlight, offering panoramic views of the Manaslu range and other Himalayan giants.",
    image: "https://cdn.bookatrekking.com/data/images/2019/11/manaslu-circuit-trek-all-you-need-to-know1.jpg",
    difficulty: "Challenging",
    bestTime: "March-May, September-November",
    duration: "14-18 days"
  },
  {
    id: 9,
    name: "Bardiya National Park",
    location: "Bardiya District, Lumbini Province",
    shortDesc: "Wild tigers, elephants, and untouched wilderness",
    fullDescription: "Bardiya National Park is Nepal's largest national park, covering 968 square kilometers of pristine wilderness. Home to the endangered Bengal tiger, one-horned rhinoceros, and wild elephants, it offers some of Asia's best wildlife viewing opportunities. The park's diverse ecosystems include tropical forests, grasslands, and riverine forests along the Karnali River. Unlike the more touristy Chitwan, Bardiya provides a raw, authentic jungle experience. Activities include tiger tracking, elephant safaris, river rafting, and bird watching with over 400 species recorded.",
    image: "https://greensocietyadventure.com/uploads/img/jungle-safari-tour-in-bardiya-national-park.webp",
    difficulty: "Easy",
    bestTime: "October-April",
    duration: "3-5 days"
  },
  {
    id: 10,
    name: "Gosaikunda",
    location: "Rasuwa District, Bagmati Province",
    shortDesc: "Sacred alpine lakes at 4,380 meters",
    fullDescription: "Gosaikunda is a group of 108 alpine lakes, with the main lake situated at 4,380 meters. These glacial lakes hold immense religious significance for Hindus, who believe they were created by Lord Shiva's trident. During the Janai Purnima festival, thousands of pilgrims make the challenging journey to take a holy dip. The trek offers stunning views of Langtang, Ganesh Himal, and Tibetan peaks. The area is rich in alpine flora and fauna, including the elusive red panda and Himalayan tahr. The crystal-clear waters perfectly reflect the surrounding snow-capped peaks.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBOf6K01TEVubML1xa5km66pdA4V-udgm8_w&s",
    difficulty: "Moderate to Challenging",
    bestTime: "April-June, September-November",
    duration: "7-9 days"
  },
  {
    id: 11,
    name: "Makalu Base Camp",
    location: "Sankhuwasabha District, Province No. 1",
    shortDesc: "Remote trek to the world's fifth-highest mountain",
    fullDescription: "The Makalu Base Camp trek is one of Nepal's most remote and challenging adventures, leading to the base of the world's fifth-highest mountain (8,485m). This wilderness trek passes through the pristine Makalu Barun National Park, home to diverse ecosystems ranging from tropical forests to alpine meadows. The route offers stunning views of Makalu, Everest, Lhotse, and Chamlang. Wildlife includes snow leopard, red panda, and over 400 bird species. The trek requires good physical fitness and wilderness experience, rewarding adventurers with unparalleled solitude and natural beauty.",
    image: "https://www.adventurewhitemountain.com/uploads/img/makalu-base-camp-trekking-in-nepal.jpg",
    difficulty: "Very Challenging",
    bestTime: "March-May, September-November",
    duration: "18-22 days"
  },
  {
    id: 12,
    name: "Api Nampa Conservation Area",
    location: "Darchula District, Sudurpashchim Province",
    shortDesc: "Far-western Nepal's pristine mountain wilderness",
    fullDescription: "Api Nampa Conservation Area protects the pristine wilderness around Api (7,132m) and Nampa (6,757m) peaks in far-western Nepal. This remote region offers untouched natural beauty, diverse ecosystems, and unique cultural experiences with local Byansi communities. The area is known for its medicinal plants, including the precious Yarsagumba (caterpillar fungus). Trekking here requires special permits and local guides, ensuring minimal environmental impact. The region offers excellent opportunities for mountaineering, botanical research, and cultural immersion in one of Nepal's least visited areas.",
    image: "https://www.landnepal.com/wp-content/uploads/2020/05/Api-Nampa-Conservation-Area.jpg",
    difficulty: "Challenging",
    bestTime: "May-October",
    duration: "20-25 days"
  },
  {
    id: 13,
    name: "Kanchenjunga Base Camp",
    location: "Taplejung District, Province No. 1",
    shortDesc: "Trek to the world's third-highest mountain",
    fullDescription: "The Kanchenjunga Base Camp trek leads to both north and south base camps of the world's third-highest mountain (8,586m). This remote wilderness trek passes through the Kanchenjunga Conservation Area, protecting diverse ecosystems and endangered species. The route offers spectacular views of Kanchenjunga's five peaks, dense rhododendron forests, and encounters with Limbu and Rai cultures. The trek is technically demanding, requiring river crossings, glacier walks, and high-altitude camping. Wildlife includes snow leopard, red panda, Himalayan black bear, and over 250 bird species.",
    image: "https://himalayantrekkers.com/_next/image?url=https%3A%2F%2Fapi.himalayantrekkers.com%2Fapi%2Ffile-upload%2Ftrips%252FMarch2021%252Fkanchenjunga-base-camp-trek.jpg&w=1080&q=75",
    difficulty: "Very Challenging",
    bestTime: "March-May, September-November",
    duration: "20-24 days"
  },
  {
    id: 14,
    name: "Dolpo Region",
    location: "Dolpa District, Karnali Province",
    shortDesc: "Remote trans-Himalayan region with ancient Bon culture",
    fullDescription: "Dolpo is Nepal's largest district and one of its most remote regions, straddling the Himalayan divide. This high-altitude desert landscape resembles Tibet, with ancient Bon and Buddhist monasteries, traditional villages, and pristine wilderness. The region was featured in Peter Matthiessen's 'The Snow Leopard' and later in the film 'Caravan'. Dolpo's isolation has preserved unique cultures, with locals practicing ancient Bon religion alongside Buddhism. The landscape features barren hills, deep gorges, turquoise lakes, and snow-capped peaks, offering one of Nepal's most authentic wilderness experiences.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHFikrviP6o22OukFj3xGDtPpXKTnMZAgoyg&s",
    difficulty: "Very Challenging",
    bestTime: "May-October",
    duration: "18-25 days"
  },
  {
    id: 15,
    name: "Nar Phu Valley",
    location: "Manang District, Gandaki Province",
    shortDesc: "Hidden valleys with medieval Tibetan culture",
    fullDescription: "Nar Phu Valley consists of two hidden valleys only opened to tourists in 2003. These medieval settlements maintain traditional Tibetan culture and architecture, with ancient monasteries, chortens, and stone houses. The valleys were historically part of the Tibet trade route, and locals still practice traditional farming and yak herding. The trek offers spectacular views of Annapurna II, Gangapurna, and other peaks. The challenging route includes river crossings, narrow gorges, and high passes. Visitors experience authentic Himalayan culture virtually unchanged for centuries.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVLyoN1W37SwyCXdrPIpDDXlq3e7dlKjMjzQ&s",
    difficulty: "Challenging",
    bestTime: "March-May, September-November",
    duration: "12-15 days"
  },
  {
    id: 16,
    name: "Tsho Rolpa Lake",
    location: "Dolakha District, Bagmati Province",
    shortDesc: "Glacial lake beneath Gaurishankar peak",
    fullDescription: "Tsho Rolpa is one of Nepal's largest glacial lakes, situated at 4,580 meters beneath the sacred Gaurishankar peak (7,134m). This pristine lake formed behind a natural moraine dam and offers stunning reflections of surrounding peaks. The trek passes through Rolwaling Valley, known as the 'Valley of the Graves' due to its remote and mysterious nature. The area is considered sacred by both Hindus and Buddhists, with Gaurishankar revered as the dwelling of Lord Shiva and Parvati. The challenging trek requires good physical fitness and mountaineering experience.",
    image: "https://nepal8thwonder.com/wp-content/uploads/2023/07/Aerial-view-of-Tsho-Rolpa-Lake.jpg",
    difficulty: "Very Challenging",
    bestTime: "April-May, September-October",
    duration: "14-18 days"
  },
  {
    id: 17,
    name: "Humla District",
    location: "Humla District, Karnali Province",
    shortDesc: "Gateway to Mount Kailash with ancient trade routes",
    fullDescription: "Humla District is one of Nepal's most remote regions, serving as the traditional gateway to Mount Kailash in Tibet. The area preserves ancient trade routes, traditional villages, and unique cultural practices influenced by Tibetan Buddhism. Simikot, the district headquarters, offers glimpses into traditional Himalayan life. The region is famous for its yarsagumba (caterpillar fungus) harvesting and maintains strong cultural ties with Tibet. Trekking in Humla requires special permits and offers encounters with Limi Valley's ancient Bon monasteries and traditional salt caravans still operating today.",
    image: "https://sidcnp.org/uploads/images/About%20Us/Humla-Simkot.jpg",
    difficulty: "Challenging",
    bestTime: "May-October",
    duration: "15-20 days"
  },
  {
    id: 18,
    name: "Mardi Himal",
    location: "Kaski District, Gandaki Province",
    shortDesc: "Newly opened trek with close-up mountain views",
    fullDescription: "Mardi Himal is a relatively new trekking destination that gained popularity for its spectacular close-up views of Machhapuchhre (Fishtail) and the Annapurna range. This hidden gem offers a perfect introduction to high-altitude trekking without the crowds of other Annapurna routes. The trek passes through beautiful rhododendron forests, traditional Gurung villages, and high-altitude meadows. The highlight is reaching Mardi Himal Base Camp at 4,500m, offering panoramic views of Annapurna South, Hiunchuli, and Machhapuchhre. The trek can be completed in a shorter time frame, making it ideal for those with limited time.",
    image: "https://asianheritagetreks.com/wp-content/uploads/2023/06/mardi-himal-trek-in-june-1024x732.jpg",
    difficulty: "Moderate",
    bestTime: "March-May, September-November",
    duration: "5-7 days"
  },
  {
    id: 19,
    name: "Dhorpatan Hunting Reserve",
    location: "Baglung, Myagdi & Rukum Districts",
    shortDesc: "Nepal's only hunting reserve with blue sheep and snow leopard",
    fullDescription: "Dhorpatan Hunting Reserve is Nepal's only hunting reserve, established in 1987 to conserve the endangered blue sheep (bharal). This high-altitude reserve spans three districts and preserves unique trans-Himalayan ecosystems. The area is home to snow leopards, Himalayan wolves, brown bears, and numerous bird species. Hunting is strictly regulated and limited to specific species under international permits. The reserve offers excellent wildlife viewing, photography opportunities, and insights into conservation efforts. The landscape features alpine meadows, rocky outcrops, and stunning views of the Dhaulagiri range.",
    image: "https://www.nepaltrekways.com/images/package_image/101/dhorpatan-hunting-reserve-1491644713.jpg",
    difficulty: "Moderate",
    bestTime: "March-May, September-November",
    duration: "8-10 days"
  },
  {
    id: 20,
    name: "Pikey Peak",
    location: "Solukhumbu District, Province No. 1",
    shortDesc: "Best viewpoint for Mount Everest sunrise",
    fullDescription: "Pikey Peak (4,065m) offers one of the best viewpoints for Mount Everest and the entire Himalayan range. Named after the local Sherpa deity Pikey, this sacred peak provides panoramic views of Everest, Makalu, Kanchenjunga, Lhotse, and countless other peaks. The trek passes through traditional Sherpa villages, ancient monasteries, and beautiful rhododendron forests. Local legend says Sir Edmund Hillary claimed this peak offers the best view of Everest. The relatively short trek is perfect for those wanting spectacular mountain views without the challenges of high-altitude trekking. The area maintains strong Sherpa culture and Buddhist traditions.",
    image: "https://res.klook.com/image/upload/c_fill,w_750,h_750/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/nq6aizldpmr5idwf1tci.jpg",
    difficulty: "Moderate",
    bestTime: "March-May, September-November",
    duration: "6-8 days"
  }
];

/* -------------------------- Appwrite helpers --------------------------- */
async function getFavoriteByUserPlace(userId: string, placeId: string) {
  const res = await databases.listDocuments<FavoriteDoc>(
    IDs.databaseId,
    IDs.favoritesColId,
    [Query.equal('userId', userId), Query.equal('placeId', placeId), Query.limit(1)]
  );
  return (res.documents?.[0] as FavoriteDoc | undefined) ?? undefined;
}

async function createFavorite(doc: NewFav) {
  return databases.createDocument<FavoriteDoc>(
    IDs.databaseId,
    IDs.favoritesColId,
    ID.unique(),
    doc as any
  );
}

/* --------------------------------- Screen -------------------------------- */
export default function HiddenGem() {
  const scheme = useColorScheme();
  const tint = Colors[scheme ?? 'light'].tint;

  const { user } = useAppwriteUser();
  const [selectedGem, setSelectedGem] = useState<Gem | null>(null);
  const [favs, setFavs] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null); // placeId in-flight

  // Seed favourites for current user
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
        console.warn('[HiddenGem] seed favs failed:', e?.message ?? e);
      }
    })();
  }, [user]);

  const isFav = (gem: Gem) => favs.includes(placeIdFor(gem));

  const toggleFav = async (gem: Gem) => {
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to save favourites.');
      return;
    }
    const pid = placeIdFor(gem);
    if (busy) return;
    setBusy(pid);

    try {
      const existing = await getFavoriteByUserPlace(user.$id, pid);
      if (existing) {
        // optimistic off
        setFavs((prev) => prev.filter((x) => x !== pid));
        await removeFavoriteById(existing.$id);
        Alert.alert('Removed', `"${gem.name}" removed from favourites.`);
      } else {
        // optimistic on
        setFavs((prev) => (prev.includes(pid) ? prev : [...prev, pid]));
        await createFavorite({
          userId: user.$id,
          placeId: pid,
          title: gem.name,
          image: gem.image,          // remote URL renders fine
          description: gem.shortDesc // optional
        });
        Alert.alert('Saved', `"${gem.name}" added to favourites.`);
      }
    } catch (e: any) {
      // rollback optimistic add
      setFavs((prev) => prev.filter((x) => x !== pid));
      Alert.alert('Error', e?.message ?? 'Could not update favourite.');
    } finally {
      setBusy(null);
    }
  };

  const renderItem: ListRenderItem<Gem> = ({ item }) => {
    const fav = isFav(item);
    return (
      <View style={styles.card}>
        <Pressable onPress={() => setSelectedGem(item)} style={{ borderRadius: 14, overflow: 'hidden' }}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <Pressable onPress={() => toggleFav(item)} hitSlop={8} style={styles.heart}>
            <IconSymbol name={fav ? 'heart.fill' : 'heart'} size={20} color={fav ? tint : '#111827'} />
          </Pressable>

          <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.cardLocation} numberOfLines={1}>📍 {item.location}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.shortDesc}</Text>
            <Text style={styles.readMore}>Tap to read more ▶</Text>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={styles.title}>🏔️ Hidden Gems of Nepal</Text>
        <Text style={styles.subtitle}>Discover Nepal&apos;s 20 best kept secrets</Text>
      </View>

      <FlatList
        data={HIDDEN_GEMS}
        keyExtractor={(g) => String(g.id)}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
      />

      {/* Details Modal */}
      {selectedGem && (
        <Modal animationType="slide" transparent={false} visible onRequestClose={() => setSelectedGem(null)}>
          <ScrollView style={styles.modalContainer} contentInsetAdjustmentBehavior="automatic">
            <Pressable style={styles.closeButton} onPress={() => setSelectedGem(null)}>
              <Text style={styles.closeButtonText}>✕ Close</Text>
            </Pressable>

            <View style={{ position: 'relative' }}>
              <Image source={{ uri: selectedGem.image }} style={styles.modalImage} />
              <Pressable
                onPress={() => toggleFav(selectedGem)}
                hitSlop={8}
                style={[styles.heart, { right: 16, top: 16, position: 'absolute' }]}
              >
                <IconSymbol
                  name={isFav(selectedGem) ? 'heart.fill' : 'heart'}
                  size={22}
                  color={isFav(selectedGem) ? tint : '#111827'}
                />
              </Pressable>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedGem.name}</Text>
              <Text style={styles.modalLocation}>📍 {selectedGem.location}</Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Difficulty:</Text>
                  <Text style={styles.detailValue}>{selectedGem.difficulty}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Best Time:</Text>
                  <Text style={styles.detailValue}>{selectedGem.bestTime}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration:</Text>
                  <Text style={styles.detailValue}>{selectedGem.duration}</Text>
                </View>
              </View>

              <Text style={styles.modalDescription}>{selectedGem.fullDescription}</Text>
            </View>
          </ScrollView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

/* -------------------------------- Styles ------------------------------- */
const CARD_GAP = 12;
const CARD_WIDTH = (width - (CARD_GAP * 3)) / 2;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },

  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.select({ ios: 8, android: 8 }),
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#2c3e50', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#7f8c8d', fontStyle: 'italic' },

  listContent: {
    paddingHorizontal: CARD_GAP,
    paddingVertical: 14,
    paddingBottom: 24,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
    justifyContent: 'space-between',
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: { width: '100%', height: 120, resizeMode: 'cover' },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    padding: 6,
    zIndex: 10,
  },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1f2937' },
  cardLocation: { fontSize: 11, color: '#ef4444', fontWeight: '700', marginTop: 2 },
  cardDesc: { fontSize: 12, color: '#475569', lineHeight: 16, marginTop: 6 },
  readMore: { fontSize: 11, color: '#2563eb', fontWeight: '700', marginTop: 8 },

  modalContainer: { flex: 1, backgroundColor: '#fff' },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  closeButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  modalImage: { width: '100%', height: 300, resizeMode: 'cover' },
  modalContent: { padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 6 },
  modalLocation: { fontSize: 14, color: '#ef4444', fontWeight: '700', marginBottom: 16 },
  detailsContainer: { backgroundColor: '#f8f9fa', borderRadius: 10, padding: 14, marginBottom: 16 },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
  detailValue: { fontSize: 14, color: '#6b7280', flex: 1, textAlign: 'right' },
  modalDescription: { fontSize: 15, color: '#374151', lineHeight: 24, textAlign: 'justify' },
});