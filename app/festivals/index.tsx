// app/festivals/index.tsx
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FESTIVALS, type Festival, byUpcoming, formatDisplayDate } from '../data/festivals';

export default function FestivalsIndex() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState<string>('');

  // get months present in data as "01", "02", ... "12"
  const months = useMemo(() => {
    const set = new Set<string>();
    FESTIVALS.forEach((f: Festival) => {
      const m = String(new Date(f.dateISO).getMonth() + 1).padStart(2, '0');
      set.add(m);
    });
    return Array.from(set).sort();
  }, []);

  // filter + sort
  const filtered: Festival[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FESTIVALS
      .filter((f: Festival) => {
        if (!monthFilter) return true;
        const m = String(new Date(f.dateISO).getMonth() + 1).padStart(2, '0');
        return m === monthFilter;
      })
      .filter((f: Festival) => {
        if (!q) return true;
        return (
          f.name.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q)
        );
      })
      .sort(byUpcoming);
  }, [query, monthFilter]);

  const openFest = (id: string) => router.push(`/festivals/${id}` as any);

  return (
    <View style={styles.safe}>
      {/* Header + Search */}
      <Text style={styles.title}>Festival Calendar</Text>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search festivals or cities"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>

        {/* Month filter */}
        <View style={styles.monthFilter}>
          <Text style={styles.monthLabel}>Month</Text>
          <FlatList
            data={['', ...months]}
            horizontal
            keyExtractor={(m: string, idx: number) => `${m || 'all'}-${idx}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }: { item: string }) => (
              <Pressable
                style={[
                  styles.monthPill,
                  item === monthFilter && styles.monthPillActive,
                ]}
                onPress={() => setMonthFilter(item === monthFilter ? '' : item)}
              >
                <Text
                  style={[
                    styles.monthText,
                    item === monthFilter && styles.monthTextActive,
                  ]}
                >
                  {item === '' ? 'All' : item}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(f: Festival) => f.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: '#6b7280' }}>No festivals found</Text>
          </View>
        )}
        renderItem={({ item }: { item: Festival }) => (
          <Pressable style={styles.card} onPress={() => openFest(item.id)}>
            <Image source={item.cover} style={styles.cover} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {formatDisplayDate(item.dateISO)} • {item.city}
              </Text>
              <Text numberOfLines={2} style={styles.desc}>
                {item.description}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 10 },

  searchRow: { gap: 12 },
  searchBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: { fontSize: 16, color: '#111827' },

  monthFilter: { marginTop: 4 },
  monthLabel: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginBottom: 6 },
  monthPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  monthPillActive: { backgroundColor: '#111827' },
  monthText: { fontSize: 12, color: '#111827', fontWeight: '700' },
  monthTextActive: { color: '#fff' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cover: { width: 100, height: 100 },
  info: { flex: 1, padding: 10, gap: 4 },
  name: { fontSize: 16, fontWeight: '800', color: '#111827' },
  meta: { fontSize: 12, color: '#6b7280' },
  desc: { fontSize: 12, color: '#374151' },

  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
});