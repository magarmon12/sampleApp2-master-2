// app/itineraries/[id].tsx
import React, { useMemo, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getItineraryById, Itinerary, DayPlan, Activity } from '../data/itineraries';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ItineraryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const itinerary: Itinerary | undefined = useMemo(
    () => (id ? getItineraryById(id) : undefined),
    [id]
  );

  const [fav, setFav] = useState(false);

  if (!itinerary) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ padding: 16, gap: 12 }}>
          <Text style={styles.title}>Itinerary not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Cover */}
        <View style={styles.header}>
          <Image source={itinerary.cover} style={styles.cover} />
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{itinerary.title}</Text>
            <Text style={styles.headerMeta}>
              {itinerary.days} days • {itinerary.startCity} • {itinerary.theme}
            </Text>
          </View>

          <Pressable onPress={() => setFav((v) => !v)} style={styles.heart}>
            <IconSymbol name={fav ? 'heart.fill' : 'heart'} size={22} color={fav ? '#ef4444' : '#111827'} />
          </Pressable>
        </View>

        {/* Highlights */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          <View style={styles.chips}>
            {itinerary.highlights.map((h: string, i: number) => (
              <View key={i} style={styles.chip}><Text style={styles.chipText}>{h}</Text></View>
            ))}
          </View>
        </View>

        {/* Day by day */}
        <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 12 }}>
          <Text style={styles.sectionTitle}>Day by day</Text>
          {itinerary.dayPlans.map((day: DayPlan) => (
            <View key={day.day} style={styles.dayCard}>
              <Text style={styles.dayTitle}>Day {day.day}: {day.title}</Text>
              {day.activities.map((a: Activity, i: number) => (
                <View key={i} style={styles.actRow}>
                  <IconSymbol name="clock" size={14} color="#6b7280" />
                  <Text style={styles.actText}>
                    {a.time ? `${a.time} • ` : ''}{a.title}{a.notes ? ` — ${a.notes}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={{ paddingHorizontal: 16, marginTop: 24, gap: 12 }}>
          <Pressable style={styles.primary}>
            <Text style={styles.primaryText}>Book this itinerary</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => router.back()}>
            <Text style={styles.secondaryText}>Back</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },

  header: { position: 'relative', width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  cover: { width: '100%', height: '100%' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  headerContent: { position: 'absolute', left: 16, right: 16, bottom: 16 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  headerMeta: { color: '#e5e7eb', marginTop: 4 },

  heart: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.95)', padding: 8, borderRadius: 999 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },

  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  chipText: { color: '#1e3a8a', fontWeight: '600', fontSize: 12 },

  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  dayTitle: { fontWeight: '800', marginBottom: 6, color: '#111827' },
  actRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  actText: { color: '#374151', flex: 1 },

  primary: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '800' },
  secondary: { paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center' },
  secondaryText: { color: '#111827', fontWeight: '700' },

  // Missing styles used by the "not found" fallback:
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  backBtn: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#e5e7eb', borderRadius: 8, alignSelf: 'flex-start' },
  backText: { fontWeight: '700', color: '#111827' },
});