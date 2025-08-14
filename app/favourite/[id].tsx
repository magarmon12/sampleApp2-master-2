// app/favourite/[id].tsx
import React, { useMemo } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View, ImageSourcePropType } from 'react-native';
import { resolveImage } from '@/lib/imageMap';
import { ADVENTURE, CULTURE, TOP_PLACES, getPlaceById, type Place } from '@/app/data/places';

const ALL_PLACES: Place[] = [...TOP_PLACES, ...ADVENTURE, ...CULTURE];
function findPlaceByTitle(t?: string) {
  if (!t) return undefined;
  const key = t.trim().toLowerCase();
  return (
    ALL_PLACES.find(p => p.title.trim().toLowerCase() === key) ||
    ALL_PLACES.find(p => key.includes(p.title.trim().toLowerCase())) ||
    ALL_PLACES.find(p => p.title.trim().toLowerCase().includes(key))
  );
}

export default function FavouriteView() {
  const { id, title, description, image, placeId } = useLocalSearchParams<{
    id?: string;
    title?: string;
    description?: string;
    image?: string;   // url / filename / key / placeId
    placeId?: string; // preferred
  }>();

  const place = useMemo(
    () => (placeId ? getPlaceById(String(placeId)) : findPlaceByTitle(title)),
    [placeId, title]
  );

  const finalTitle = String(title || place?.title || 'Untitled');
  const finalDesc  = String(description || place?.description || 'No description provided.');

  const heroSource: ImageSourcePropType | undefined = useMemo(() => {
    // If local data has a bundled asset (static require), use it directly
    if (place?.image && (typeof place.image === 'number' || typeof place.image === 'object')) {
      return place.image as any;
    }
    // Otherwise resolve from string: param image → placeId → title
    const key = (image || place?.id || finalTitle) as string;
    return resolveImage(key);
  }, [image, place?.image, place?.id, finalTitle]);

  return (
    <>
      <Stack.Screen options={{ title: 'Favourite – View', headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.body}>
        {heroSource ? (
          <Image source={heroSource} style={styles.hero} />
        ) : (
          <View style={[styles.hero, styles.heroEmpty]}>
            <Text style={{ color: '#6b7280' }}>No image</Text>
          </View>
        )}
        <Text style={styles.title}>{finalTitle}</Text>
        <Text style={styles.desc}>{finalDesc}</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: { paddingBottom: 32 },
  hero: { width: '100%', height: 260, backgroundColor: '#e5e7eb' },
  heroEmpty: { alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', marginTop: 16, marginHorizontal: 16, color: '#0f172a' },
  desc: { fontSize: 16, marginTop: 10, marginHorizontal: 16, color: '#334155', lineHeight: 22 },
});