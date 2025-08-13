// app/itineraries/index.tsx
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getItineraries, Itinerary } from '../data/itineraries';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ItinerariesIndex() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const items = getItineraries();

  const filtered = useMemo<Itinerary[]>(
    () =>
      items.filter((i: Itinerary) =>
        i.title.toLowerCase().includes(q.toLowerCase()) ||
        i.highlights.some((h: string) => h.toLowerCase().includes(q.toLowerCase())) ||
        i.startCity.toLowerCase().includes(q.toLowerCase())
      ),
    [q, items]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Itineraries</Text>
        <View style={styles.search}>
          <IconSymbol name="magnifyingglass" size={16} color="#6b7280" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search (city, highlight, title)"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it: Itinerary) => it.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }: { item: Itinerary }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/itineraries/[id]', params: { id: item.id } })}
            style={styles.card}
          >
            <Image source={item.cover} style={styles.cover} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.meta}>{item.days} days • {item.startCity}</Text>
              <View style={styles.chips}>
                {item.highlights.slice(0, 3).map((h: string, idx: number) => (
                  <View key={idx} style={styles.chip}><Text style={styles.chipText}>{h}</Text></View>
                ))}
              </View>
            </View>
            <IconSymbol name="chevron.right" size={18} color="#9ca3af" />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16, gap: 10 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  input: { flex: 1, color: '#111827', paddingVertical: 0 },

  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 10, flexDirection: 'row', gap: 10, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cover: { width: 72, height: 72, borderRadius: 8 },
  cardTitle: { fontWeight: '800', color: '#111827' },
  meta: { marginTop: 2, color: '#6b7280', fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  chipText: { fontSize: 11, color: '#374151' },
});