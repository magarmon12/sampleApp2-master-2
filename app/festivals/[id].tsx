// app/festivals/[id].tsx
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FESTIVALS, type Festival, formatDisplayDate } from '../data/festivals';

export default function FestivalDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const fest: Festival | undefined = useMemo(
    () => FESTIVALS.find((f: Festival) => f.id === id),
    [id]
  );

  if (!fest) {
    return (
      <View style={styles.safe}>
        <Text style={{ padding: 16, color: '#111827', fontWeight: '700' }}>
          Festival not found.
        </Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.safe} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Header with cover */}
      <View style={styles.header}>
        <Image source={fest.cover} style={styles.cover} />
        <View style={styles.headerOverlay} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>{fest.name}</Text>
          <Text style={styles.meta}>
            {formatDisplayDate(fest.dateISO)} • {fest.city}
          </Text>

          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{fest.description}</Text>

        {fest.highlights?.length ? (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Highlights</Text>
            <View style={styles.chips}>
              {fest.highlights.map((h: string, i: number) => (
                <View key={`${h}-${i}`} style={styles.chip}>
                  <Text style={styles.chipText}>{h}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Plan your visit</Text>
        <Text style={styles.secondaryText}>
          Book transport and hotels early, especially during peak days. Arrive a day early to settle in,
          and carry cash for local markets. Respect local customs and dress modestly around temples.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },

  header: { position: 'relative', width: '100%', aspectRatio: 2, backgroundColor: '#e5e7eb' },
  cover: { width: '100%', height: '100%' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  headerContent: { position: 'absolute', left: 16, right: 16, bottom: 16, gap: 8 },

  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  meta: { color: '#e5e7eb', fontSize: 13 },

  backBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(17,24,39,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
  },
  backText: { color: '#fff', fontWeight: '800' },

  body: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 6 },
  description: { color: '#374151', lineHeight: 20 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  chipText: { color: '#111827', fontWeight: '700', fontSize: 12 },

  secondaryText: { color: '#6b7280', lineHeight: 20 },
});