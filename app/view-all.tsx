// app/view-all.tsx
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getByCategory, Place } from './data/places';

export default function ViewAll() {
  const { category } = useLocalSearchParams<{ category?: 'top' | 'adventure' | 'culture' }>();
  const [q, setQ] = useState('');

  const data = useMemo(() => {
    const base = getByCategory((category ?? 'top') as any);
    const query = q.trim().toLowerCase();
    if (!query) return base;
    return base.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
  }, [category, q]);

  const headerTitle =
    category === 'adventure' ? 'Adventure' : category === 'culture' ? 'Culture' : 'Top Places';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={18} color="#6b7280" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search places"
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={data.slice(0, 15)}           // show up to ~15 rows
        keyExtractor={(item: Place) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/location-details', params: { id: item.id } })}
            style={styles.row}
          >
            <Image source={item.image} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              {!!item.location && <Text style={styles.rowMeta}>{item.location}</Text>}
              <Text numberOfLines={2} style={styles.rowDesc}>{item.description}</Text>
            </View>
            <IconSymbol name="chevron.right" size={18} color="#9ca3af" />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 8 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff',
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  searchInput: { flex: 1, paddingVertical: 0, color: '#111827' },

  row: {
    backgroundColor: '#fff', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  thumb: { width: 72, height: 72, borderRadius: 8 },
  rowTitle: { fontWeight: '800', color: '#111827' },
  rowMeta: { color: '#6b7280', marginTop: 2, marginBottom: 4, fontSize: 12 },
  rowDesc: { color: '#374151', fontSize: 12 },
});